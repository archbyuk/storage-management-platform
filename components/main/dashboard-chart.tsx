"use client";

import { calculatePercentage, convertFileSize } from "@/lib/utils";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { 
    ChartConfig, 
    ChartContainer 
} from "@/components/ui/chart";

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

const chartConfig = {
    size: {
      label: "Size",
    },
    used: {
      label: "Used",
      color: "white",
    },
} satisfies ChartConfig

export default function DashboardChart( { used }: { used: number} ) {
    
    // Function to calculate the percentage of used space
    const chartData = [
        { 
            storage: "used", 
            20: used, 
            fill: "white" }
    ];

    return (
        <Card className="chart">
            <CardContent className="flex-1">
                <ChartContainer config={chartConfig} className="chart-container">
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={Number(calculatePercentage(used)) + 90}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="polar-grid"
                            polarRadius={
                                [86, 70]
                            }
                        />
                        
                        <RadialBar dataKey="storage" background cornerRadius={50} />
                        
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={(
                                    { viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={ viewBox.cx } y={ viewBox.cy } textAnchor="middle" dominantBaseline="middle">
                                                    
                                                    <tspan x={ viewBox.cx } y={ viewBox.cy } className="chart-total-percentage">
                                                        {used && calculatePercentage(used)
                                                            ? calculatePercentage(used)
                                                                .toString()
                                                                    .replace(/^0+/, "")
                                                            : "0"
                                                        }%
                                                    </tspan>
                                                    
                                                    <tspan x={ viewBox.cx } y={ (viewBox.cy || 0) + 24 } className="subtitle-2 fill-white/90">
                                                        Space used
                                                    </tspan>
                                            
                                                </text>
                                            );
                                        }
                                }}
                            /> 
                        </PolarRadiusAxis>
                    
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>

            <CardHeader className="chart-details">
                <CardTitle className="chart-title">
                    Available Storage
                </CardTitle>
                
                <CardDescription className="chart-description whitespace-nowrap">
                    { used ? convertFileSize(used) : "2GB" } / 2GB
                </CardDescription>
            </CardHeader>
        </Card>
    )
}