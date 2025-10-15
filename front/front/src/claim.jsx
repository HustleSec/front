import './App.css'

export default function Claim({value})
{
	return (
		<div className='claim-div'>
			<h1 className='claim-text1' style={{opacity: value}}>
				CLAIM VICTORY<br/>
			</h1>
			<h2 className='claim-text' style={{opacity: value}}>
				Get ready to serve, smash, and spin your way  <br/>
				to victory in Ultimate Ping Pong Challenge. <br/>
				This fast-paced and addictive table tennis<br/> 
				game brings realistic physics.
			</h2>
		</div>

	);
}