import ExcelJS from "exceljs";

import type { AttemptRecord, Instrument } from "@/lib/types";

function formatInstrumentDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year.slice(-2)}`;
}

function getCriterionMark(
  instrument: Instrument,
  attempt: AttemptRecord | undefined,
  criterionId: string,
) {
  if (!attempt) {
    return "";
  }

  const sourceQuestion = instrument.questions.find(
    (question) => question.criterionId === criterionId && question.type === "single",
  );

  if (!sourceQuestion) {
    return "";
  }

  const value = attempt.answers[sourceQuestion.id];
  if (value === "si") return "si";
  if (value === "no") return "no";
  if (value === "parcial") return "parcial";
  return "";
}

function applyBorder(cell: ExcelJS.Cell) {
  cell.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };
}

function styleRange(
  worksheet: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  fill?: string,
) {
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const cell = worksheet.getCell(row, col);
      applyBorder(cell);
      if (fill) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fill },
        };
      }
    }
  }
}

export async function buildInstrumentWorkbook(
  instrument: Instrument,
  attempts: AttemptRecord[],
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Instrumento");
  const criteriaCount = instrument.criteria.length;
  const totalColumns = 2 + criteriaCount * 2;
  const rows = attempts.length > 0 ? attempts.slice(0, 10) : [];

  worksheet.properties.defaultRowHeight = 24;
  worksheet.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.35,
      bottom: 0.35,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.columns = [
    { width: 8 },
    { width: 44 },
    ...instrument.criteria.flatMap(() => [{ width: 7 }, { width: 7 }]),
  ];

  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell(1, 1).value = "INSTRUMENTO DE EVALUACIÓN";
  worksheet.getCell(1, 1).font = { bold: true, size: 14 };
  worksheet.getCell(1, 1).alignment = { horizontal: "center", vertical: "middle" };

  worksheet.mergeCells(2, 1, 2, totalColumns);
  worksheet.getCell(2, 1).value = "LISTA DE COTEJOS";
  worksheet.getCell(2, 1).font = { bold: true, size: 12 };
  worksheet.getCell(2, 1).alignment = { horizontal: "center", vertical: "middle" };

  worksheet.mergeCells(4, 1, 4, totalColumns);
  worksheet.getCell(4, 1).value = "DATOS INFORMATIVOS";
  worksheet.getCell(4, 1).font = { bold: true, size: 11 };
  worksheet.getCell(4, 1).alignment = { horizontal: "left", vertical: "middle" };

  worksheet.mergeCells(5, 1, 5, 6);
  worksheet.getCell(5, 1).value = `Profesora: ${instrument.teacher}`;
  worksheet.mergeCells(5, 7, 5, totalColumns);
  worksheet.getCell(5, 7).value = `Fecha: ${formatInstrumentDate(instrument.date)}`;

  worksheet.mergeCells(6, 1, 6, 6);
  worksheet.getCell(6, 1).value = `Nivel: ${instrument.level.toLowerCase()}`;
  worksheet.mergeCells(6, 7, 6, totalColumns);
  worksheet.getCell(6, 7).value = `Unidad: ${instrument.unit}`;

  worksheet.mergeCells(7, 1, 7, 6);
  worksheet.getCell(7, 1).value = `Sesión: "${instrument.sessionTitle}"`;
  worksheet.mergeCells(7, 7, 7, totalColumns);
  worksheet.getCell(7, 7).value = `Modalidad: ${instrument.modality.toUpperCase()}`;

  worksheet.mergeCells(9, 1, 9, 2);
  worksheet.getCell(9, 1).value = "PROPÓSITOS DE APRENDIZAJE";
  worksheet.mergeCells(9, 3, 9, totalColumns);
  worksheet.getCell(9, 3).value = "CRITERIOS DE EVALUACIÓN";

  worksheet.getCell(10, 1).value = "Propósito";
  worksheet.getCell(11, 1).value = "Competencia";
  worksheet.getCell(12, 1).value = "Capacidad";
  worksheet.getCell(13, 1).value = "Desempeño precisado";

  worksheet.getCell(10, 2).value = instrument.purpose;
  worksheet.getCell(11, 2).value = instrument.competence;
  worksheet.getCell(12, 2).value = instrument.capacities.map((item) => `• ${item}`).join("\n");
  worksheet.getCell(13, 2).value = instrument.performance;

  instrument.criteria.forEach((criterion, index) => {
    const startCol = 3 + index * 2;
    worksheet.mergeCells(10, startCol, 13, startCol + 1);
    worksheet.getCell(10, startCol).value = criterion.description;
    worksheet.getCell(10, startCol).alignment = {
      wrapText: true,
      vertical: "top",
      horizontal: "left",
    };
  });

  worksheet.getCell(14, 1).value = "N°";
  worksheet.getCell(14, 2).value = "NOMBRES Y APELLIDOS";
  instrument.criteria.forEach((criterion, index) => {
    const startCol = 3 + index * 2;
    worksheet.getCell(14, startCol).value = "SI";
    worksheet.getCell(14, startCol + 1).value = "NO";
  });

  const exportRows = rows.length > 0 ? rows : Array.from({ length: 8 }, () => undefined);
  exportRows.forEach((attempt, rowIndex) => {
    const excelRow = 15 + rowIndex;
    worksheet.getCell(excelRow, 1).value = `${rowIndex + 1}.`;
    worksheet.getCell(excelRow, 2).value = attempt?.student.fullName.toUpperCase() ?? "";

    instrument.criteria.forEach((criterion, criterionIndex) => {
      const startCol = 3 + criterionIndex * 2;
      const mark = getCriterionMark(instrument, attempt, criterion.id);
      worksheet.getCell(excelRow, startCol).value =
        mark === "si" ? "X" : mark === "parcial" ? "/" : "";
      worksheet.getCell(excelRow, startCol + 1).value = mark === "no" ? "X" : "";
    });
  });

  [1, 2].forEach((row) => {
    for (let col = 1; col <= totalColumns; col += 1) {
      worksheet.getCell(row, col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE5BEA1" },
      };
    }
  });

  styleRange(worksheet, 4, 4, 1, totalColumns, "FFF0D9C7");
  styleRange(worksheet, 5, 7, 1, totalColumns, "FFF6EBE0");
  styleRange(worksheet, 9, 9, 1, 2, "FFE5BEA1");
  styleRange(worksheet, 9, 9, 3, totalColumns, "FFE5BEA1");
  styleRange(worksheet, 10, 13, 1, 2, "FFF6EBE0");
  styleRange(worksheet, 10, 13, 3, totalColumns, "FFF8F8F8");
  styleRange(worksheet, 14, 14, 1, totalColumns, "FFEFE3BF");
  styleRange(worksheet, 15, 14 + exportRows.length, 1, totalColumns, "FFFFFFFF");

  for (let row = 4; row <= 14 + exportRows.length; row += 1) {
    for (let col = 1; col <= totalColumns; col += 1) {
      const cell = worksheet.getCell(row, col);
      applyBorder(cell);
      cell.alignment = cell.alignment ?? { vertical: "middle", horizontal: "center" };
      cell.font = cell.font ?? { name: "Arial", size: 10 };
    }
  }

  worksheet.getRow(10).height = 54;
  worksheet.getRow(11).height = 34;
  worksheet.getRow(12).height = 72;
  worksheet.getRow(13).height = 60;
  worksheet.getRow(14).height = 34;

  return workbook;
}
