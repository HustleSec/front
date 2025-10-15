import ReactCurvedText from 'react-curved-text';

export default function Circular()
{
	return (
	<div
	className="spinning-circle"
	style={{
		animation: "spin 20s linear infinite",
	}}
	>
              <ReactCurvedText
                width={300}
                height={300}
                cx={150}
                cy={150}
                rx={100}
                ry={100}
                startOffset={0}
                reversed={false}
                text="PLAY AGAINST YOUR FRIENDS AT NXTGNX CHAMPIONSHIP ONLINE"
                textProps={{
                  style: {
                    fontSize: 15,
                    fontWeight: "bold",
                    fill: "#FFE607",
                    letterSpacing: "2px",
                  },
                }}
                svgProps={{
                  style: {
                    overflow: "visible",
                  },
                }}
              />
        </div>
	);
}