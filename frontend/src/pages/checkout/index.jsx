import dynamic from "next/dynamic";

const CheckoutLayout = dynamic(() => import("../../components/checkout/CheckoutLayout"), {
  ssr: false,
});

export default function CheckoutPage() {
  return <CheckoutLayout />;
}
