import React from 'react'
import './ImageGenerator.css'
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { Add ,Edit, Share, Download} from "@mui/icons-material";

export const ImageGenerator = () => {

    const [images, setImages] = useState([]);
	const [mainImg, setMainImg] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [promt, setPromt] = useState("");
	const [manga, setManga] = useState([]);

	async function query(data) {
		try {
			setIsLoading(true);
			const response = await fetch(
				"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
				{
					headers: {
						Accept: "image/png",
						Authorization:
							"Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify(data),
				}
			);
			const result = await response.blob();
			setIsLoading(false);
			return result;
		} catch (e) {
			setIsLoading(false);
			console.log("error");
		}
	}

	const generate_img = () => {
		for(let i = 0; i < 10; i++){
			if(i===0){
				setImages([])
			}
			query({ inputs: promt }).then((response) => {
			const imageUrl = URL.createObjectURL(response);
			setImages((prev)=>([...prev, imageUrl]));
			console.log(imageUrl);
		})}
	};
	const handleMainImg = (index) => {
		console.log(index);
		setMainImg(images[index]);
	};

	
	const handleEnterKeyPress = (e) => {
		if (e.key === 'Enter') {
			generate_img();
		}
	}

	const AddPanel = () => {
		setManga((prev) => [...prev, mainImg]);
	}

  return (
    <div className="app">

		{/* NavBar */}
		<nav>
			<input type="checkbox"  id="check"/>
			<label htmlFor="check" className='checkbtn'>
				<HorizontalSplitIcon/>
			</label>
			<label htmlFor="" className='logo'>Comic <span>Creator</span></label>
			<ul>
				<li><a href="##" className='active' >Home</a></li>
				<li><a href="##" >About</a></li>
				<li><a href="##" >Service</a></li>
				<li><a href="##" >Contact</a></li>
			</ul>
		</nav>

		{/* Container */}
		<div className="container">

			<div className="leftPanel">
				<textarea
					onKeyDown={handleEnterKeyPress}
					className="text_area"
					onChange={(e) => setPromt(e.target.value)}
					type="text"
					placeholder="Enter text for image"
				/>
				<div className="buttons">
					<button className="generate_btn" onClick={generate_img}>
						Generate <CheckCircleIcon />
					</button>
					
				</div>
				{isLoading ? (
					<div className="isLoading">
						<p>Generating Images...</p>
					</div>
				) : (
				images.map((image, index) => (
					<img onClick={() => handleMainImg(index)} key={index} src={image} alt="Images not found" className='images'/>
				))
				)}
			</div>
			<div className="rightPanel">
				<div className='strip'><h2>Selected Panel</h2></div>
				{
					<img className="main" src={mainImg} alt="" />
				}
				<div className="buttons" id="btn-panel">
					<button className='Add_btn' onClick={AddPanel}>Add in strip<Add/></button>
					<button className='Edit_btn'>Edit <Edit/></button>
				</div>
				<div>
					<div className='strip'><h2>Your Comic Strip</h2></div>
					<div className="strip_container" id="strip_container">
						{
							manga.map((image, index) => (
								<img src={image} key={index} alt=""  className='strip_img'/>
							))
						}
					</div>
					<div className="buttons" id="btn-panel">
						<button className='download_btn'>Download<Download/></button>
						<button className='share_btn'>Share <Share/></button>
					</div>
				</div>
			</div>
		</div>
	</div>
  )
}
export default ImageGenerator;
