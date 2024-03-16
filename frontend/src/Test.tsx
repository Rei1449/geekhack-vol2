import { useEffect } from "react";

export default function Test() {
	const fetchHello = async() => {
		const res = await fetch('https://hack-fast-api-65ce6a3d3ac6.herokuapp.com/').then(data=>data.json());
		console.log(res)
	}
	useEffect(()=>{
		fetchHello()
	},[])
	return <div>test</div>;
}
