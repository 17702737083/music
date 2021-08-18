import React from 'react';
import {
	Chart,
	Interval,
	Coordinate,
	Legend,
	View,
	Annotation,
	getTheme,
} from "bizcharts";
const Ring =(props:any,intervalConfig = {})=>{
    const {content,data}=props;
	const brandFill = getTheme().colors10[0];
    return (
		<Chart placeholder={false} height={100} padding="auto" autoFit>
			<Legend visible={false} />
			{/* 绘制图形 */}
			<View
				data={data}
				scale={{
					percent: {
						formatter: (val) => {
							return (val * 100).toFixed(0) + "%";
						},
					},
				}}
			>
				<Coordinate type="theta" innerRadius={0.75} />
				<Interval
					position="percent"
					adjust="stack"
					color={["type", [ "#3BAEE5","#fff",]]}
					size={6}//设置圆环的大小
					{...intervalConfig}
				/>
                <Annotation.Text
                   	position={["50%", "40%"]}
                    content={content.percent}
                    style={{
                        lineHeight:120,
						fontSize:23,
						fill: brandFill,
						textAlign: 'center'
					}}
                />
                <Annotation.Text
                   	position={["50%", "62%"]}
                    content={content.siteCode}
                    style={{
                        lineHeight:120,
						fontSize:12,
						fill: brandFill,
                        textAlign: 'center',
                        marginTop:15,
					}}
                />
			</View>
		</Chart>
	);
}
export default Ring;