import { Bar, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { BarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";

import React from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { api } from "@/trpc/react";
import { formatFirestoreTimestamp } from "@/utils/random";

const BarChartMain = () => {
    const chartConfig = {
        token: {
          label: "Token",
          color: "hsl(var(--chart-1))",
        },
      } satisfies ChartConfig;

      const {data:txns} = api.txn.getLatestTxn.useQuery({limit: 7})
      
      const newChartData = txns?.map(txn => ({
          time:  formatFirestoreTimestamp(
            txn.timestamp,
          )?.time,
          token: txn.amount
        })).reverse()
  return (
    <div>
         <Card
              style={{
                width: "800px",
                // height:"300px",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <CardContent>
                <div>
                    <h1 className="text-3xl text-white">Token Transferred</h1>
                </div>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={newChartData}
                    margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                    height={200}
                    style={{ width: "100%" }}
                  >
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value as string}
                      tick={{ fontSize: 16 }}
                    />
                    <YAxis
                      dataKey="token"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value as string}
                      tick={{ fontSize: 16 }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <CartesianGrid horizontal={false} vertical={false} />
                    <Bar dataKey="token" fill="#38F68F">
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={16}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
    </div>
  )
}

export default BarChartMain