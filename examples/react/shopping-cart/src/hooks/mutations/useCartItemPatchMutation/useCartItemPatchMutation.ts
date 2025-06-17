import { CartItemApi, type PatchCartItemsParams } from "@/apis";
import { useMutation } from "@guesung/query";

export default function useCartItemPatchMutation() {
	return useMutation<PatchCartItemsParams, void>({
		mutationFn: CartItemApi.patchCartItems,
	});
}
