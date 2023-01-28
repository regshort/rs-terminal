import moment from "moment";

export function dateIndexToString(index: number) {
  switch (index) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    case 2:
      return "Last week";
    case 3:
      return "Last month";
    case 4:
      return "Last 3 months";
    case 5:
      return "Last 6 months";
    case 6:
      return "Last year";
    case 7:
      return "Last 2 years";
    default:
      undefined;
      break;
  }
}
export function dateStringToIndex(string: string) {
  switch (string) {
    case "Today":
      return 0;
    case "Yesterday":
      return 1;
    case "Last week":
      return 2;
    case "Last month":
      return 3;
    case "Last 3 months":
      return 4;
    case "Last 6 months":
      return 5;
    case "Last year":
      return 6;
    case "Last 2 years":
      return 7;
    default:
      undefined;
      break;
  }
}
export function string2DateRange(input: string) {
  switch (input) {
    case "Today":
      return [moment().toDate(), moment().toDate()];
    case "Yesterday":
      return [moment().subtract(1, "days").toDate(), moment().toDate()];
    case "Last week":
      return [moment().subtract(1, "weeks").toDate(), moment().toDate()];
    case "Last month":
      return [moment().subtract(1, "months").toDate(), moment().toDate()];
    case "Last 3 months":
      return [moment().subtract(3, "months").toDate(), moment().toDate()];
    case "Last 6 months":
      return [moment().subtract(6, "months").toDate(), moment().toDate()];
    case "Last year":
      return [moment().subtract(12, "months").toDate(), moment().toDate()];
    case "Last 2 years":
      return [moment().subtract(24, "months").toDate(), moment().toDate()];
    default:
      undefined;
      break;
  }
}
