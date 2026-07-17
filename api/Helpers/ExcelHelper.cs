using ClosedXML.Excel;
using MovieWorld.Dtos;
using System.Reflection;

public static class ExcelHelper
{
    public static byte[] GenerateExcelFile<T>(List<T> items, List<string> headers, string sheetName = "data")
    {
        using(var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add(sheetName);

            PropertyInfo[] properties = typeof(T).GetProperties();

            if (headers.Count != properties.Length)
                throw new ArgumentException("Headers's Length and proprierties length are not the same");

            for(int i=0; i<headers.Count; i++)
            {
                worksheet.Cell(1, i + 1).Value = headers[i];
            }

            for(int i=0; i<items.Count; i++)
            {
                for(int j=0; j<properties.Length; j++)
                {
                    var value = properties[j].GetValue(items[i]);

                    if (value is IEnumerable<object> list && value is not string)
                    {
                        var stringList = new List<string>();
                        foreach(var item in list)
                        {
                            stringList.Add(item.ToString() ?? "");
                        }
                        worksheet.Cell(i+2,j+1).Value = string.Join(", ", stringList);
                    }
                    else
                    {
                        worksheet.Cell(i + 2, j + 1).Value = value != null ? XLCellValue.FromObject(value) : Blank.Value;
                    }
                }
            }
            worksheet.Columns().AdjustToContents();

            worksheet.Column(1).Hide();

            using(var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }
}