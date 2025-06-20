import { CartItemApi } from "@/apis";
import { QUERY_KEY } from "@/constants";
import { useQuery } from "@guesung/query";

export default function useCartItemQuery() {
	return useQuery({
		queryFn: CartItemApi.getCartItems,
		queryKey: QUERY_KEY.cartItem,
		initialData: { content: [] },
	});
}
