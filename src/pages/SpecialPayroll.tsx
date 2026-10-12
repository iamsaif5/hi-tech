import OffCyclePayroll from "./OffCyclePayroll";

/** Public holidays and back pay — an explicit date range, every day paid. */
export default function SpecialPayroll() {
  return <OffCyclePayroll runType="special" />;
}
