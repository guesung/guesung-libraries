import { CouponApi } from "@/apis";
import { QUERY_KEY } from "@/constants";
import { useQuery } from "@guesung/query";

export default function useCouponQuery() {
	return useQuery({
		queryFn: CouponApi.getAllCoupons,
		queryKey: QUERY_KEY.coupon,
		initialData: [],
	});
}
