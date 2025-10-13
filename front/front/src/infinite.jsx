import './App.css'

export default function Infinite()
{
	return (
		<div className='logos'>
			<div className='logos-slide'>
			{Array(20).fill('Play Now__').map((text, i) => (
			<h3 className="test" key={i}>{text}</h3>
			))}
			</div>
			<div className='logos-slide'>
			{Array(20).fill('Play Now__').map((text, i) => (
			<h3 className="test" key={i}>{text}</h3>
    	    ))}
			</div>
		</div>
	);
}