import "./User.css";
import { useState, useEffect } from "react";
import { storage } from "./firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
  list,
} from "firebase/storage";
import { useStateValue } from "./stateProvider";
import { saveAs } from 'file-saver'
export default function User() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [{ user }, dispatch] = useStateValue();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const listRef = ref(storage, `${user.email}/`);

    list(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          getDownloadURL(ref(storage, itemRef))
            .then((url) => {
              setFiles((prev) => [...prev, url]);

              // Or inserted into an <img> element
            })
            .catch((error) => {
              // Handle any errors
            });
        });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
      let a=[];
      console.log(files.length/2);
      for(let i=0;i!==files.length/2;i++){
        a.push(files[i]);
      }
      console.log(a);
      setFiles(a);
   
  }, []);
  function handleDownload(event) {
    event.preventDefault();
    saveAs( event.target.value,'image_url'); 
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];

    if (!file) return;
    const storageRef = ref(storage, `${user.email}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="App">
    <h3>Manage your health records,you can upload  ur health records or can download them</h3>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" />
        <button type="submit">Upload</button>
      </form>
      {!imgUrl && (
        <div className="outerbar">
          <div className="innerbar" style={{ width: `${progresspercent}%` }}>
            {progresspercent}%
          </div>
        </div>
      )}

      {files.map((val) => {
        return (
          <div className="user-card">
            <img src={val} className="user-img" alt="hcqKUH" />
            <button value={val} onClick={handleDownload}>Download</button>
          </div>
        );
      })}
    </div>
  );
}