import ShoppingItemDetail from "@/components/ShoppingItemDetail";

export default function Page({ params }: { params: { id: number } }) {
  return (
    <h1>
      <ShoppingItemDetail />
    </h1>
  );
}
