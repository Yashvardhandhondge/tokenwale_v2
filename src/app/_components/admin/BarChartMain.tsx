import { Bar, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { BarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";

import React from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const BarChartMain = () => {
    const chartConfig = {
        token: {
          label: "Token",
          color: "hsl(var(--chart-1))",
        },
      } satisfies ChartConfig;

      const chartData = [
        { time: "10.12 am", token: 186 },
        { time: "11 am", token: 305 },
        { time: "12 pm", token: 237 },
        { time: "1 pm", token: 73 },
        { time: "2 pm", token: 209 },
        { time: "3 pm", token: 21 },
        { time: "4 pm", token: 204 },
        { time: "5 pm", token: 234 },
        { time: "6 pm", token: 74 },
        { time: "7 pm", token: 94 },
        { time: "8 pm", token: 35 },
        { time: "9 pm", token: 305 },
      ]
  return (
    <div>
         <Card
              style={{
                width: "100%",
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
                    data={chartData}
                    margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                    height={360}
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