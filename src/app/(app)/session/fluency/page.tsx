import { getFluencyText } from "@/lib/fluency";
import { FluencySession } from "@/components/FluencySession";

export default async function FluencySessionPage() {
  const text = await getFluencyText();
  return <FluencySession key={text?.id} text={text} />;
}
