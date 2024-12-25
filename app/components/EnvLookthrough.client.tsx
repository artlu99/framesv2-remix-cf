import { AppType } from "@root/server";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<AppType>("/");

const EnvLookthrough = () => {
  const query = useQuery({
    queryKey: ["env"],
    queryFn: async () => {
      const res = await client.hono.$get({ query: { queryToken: "public" } });
      return await res.json();
    },
  });

  return (
    <span className="prose">
      My_var: <code>{query.data?.My_var ?? "<Missing response>"}</code>
    </span>
  );
};
export default EnvLookthrough;
