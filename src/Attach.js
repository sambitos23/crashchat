import React, {useEffect, useState} from 'react';
import {firebase} from "./firebase";
import "./Attach.css";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { v4 as uuidv4 } from 'uuid';

function Attach() {

    const [imageUrl, setImageUrl] = useState([]);
    const readImages = async (e) =>{
        const file= e.target.files[0];
        const id = uuidv4();
        const storageRef = firebase.storage().ref("images").child(id);
        const imageRef = firebase.database().ref('images').child("daily").child(id);
        await storageRef.put(file);
        storageRef.getDownloadURL().then((url)=>{
            imageRef.set(url);
            const newState = [...imageUrl, {id, url}];
            setImageUrl(newState);
        });
        console.log(file);
    };

    const getImageUrl = () =>{
        const imageRef = firebase.database().ref('images').child("daily")
        imageRef.on("value",(snapshot)=> {
            const imageUrls = snapshot.val();
            const urls = [];
            for(let id in imageUrls){
                urls.push({id, url:imageUrls[id]});
            }
            const newState = [...imageUrl, ...urls];
            setImageUrl(newState);
            // console.log(snapshot.val());
        });
    };
    useEffect(() => {
        getImageUrl();
    }, [])

    return (
        <div>
            <h1>Upload Files</h1>
            <AttachFileIcon />
            <input type="file" accept="file_extension|audio/*|video/*|image/*|media_type" onChange={readImages} className="icon"/>
            {/* <div> */}
                {imageUrl ? imageUrl.map(({id,url}) => {
                    return <div key={id}>
                        {/* <img src={url} alt="" className="imagechat"/> */}
                        <a href={url} target="_blank">{imageUrl==="" ? '' : 'Click Here'}</a>
                    </div>
                }):""}
                <img src={imageUrl} alt="" className="imagechat" /> 
                {/* <a href={imageUrl} target="_blank">{imageUrl==="" ? '' : 'Click Here'}</a> */}
            {/* </div>  */}
            
        </div>
    )
}

export default Attach;
