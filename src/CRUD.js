import {useState, useEffect} from 'react'
import {db} from './fbconfig'
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from 'firebase/firestore'
import {storage} from './fbconfig'
import {ref, getDownloadURL, uploadBytesResumable} from '@firebase/storage'
import './scp.css'

function CRUD()
{
    const [dataItem, setDataItem]=useState("")
    const [dataDescription, setDataDescription]=useState("")
    const [dataContainment, setDataContainment]=useState("")
    const [dataObjectClass, setDataObjectClass]=useState("")

    const [readData, setReadData]=useState([])

    const[id,setId]=useState("")
    const[showDoc, setShowDoc]=useState(false)

    const[image, setImage]=useState(null)
    const[imageURL, setImageURL]=useState("")

    const ourCollection = collection(db,"data")

    useEffect(()=>{
        const getData=async()=>
        {
            const ourDocsToRead =await getDocs(ourCollection)
            setReadData(
                ourDocsToRead.docs.map(
                    doc=>({...doc.data(),id:doc.id})
                )
            )
        }
        getData()
    },[])

    const crudCreate = async () => {
        await addDoc(ourCollection, {item:dataItem, objectClass:dataObjectClass, description:dataDescription, containment:dataContainment, imageURL:imageURL})
    }

    const crudDelete = async (id)=>{
        const docToDelete = doc(db,"data",id)
        await deleteDoc(docToDelete)
    }

    // add for edit button, this will show document/record in the main form
    const showEdit=(id,item,objectClass,description,containment, imageURL)=>{
        setDataItem(item)
        setDataObjectClass(objectClass)
        setDataDescription(description)
        setDataContainment(containment)
        setImageURL(imageURL)
        setId(id)
        setShowDoc(true)
    }

    // update document that is shown in the main form
    const crudUpdate=async ()=>{
        const updateData = doc(db,"data",id)
        await updateDoc(updateData,{item:dataItem,objectClass:dataObjectClass,description:dataDescription,containment:dataContainment, imageURL:imageURL})
        setShowDoc(false)
        setDataItem("")
        setDataObjectClass("")
        setDataDescription("")
        setDataContainment("")
    }

    const handleImageChange = (e) => {
        if(e.target.files[0])
        {
            setImage(e.target.files[0])
        }
    }

    const uploadImage = async () => {
        const storageRef = ref(storage, 'images/' + image.item)
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload '+progress+'% done.')
        },
        (error)=>{console.log(error)},
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            setImageURL(downloadURL)
        }
        )
    }

    return(
        <>
            <div className="container2">
            <input value={dataItem} onChange={(item) =>setDataItem(item.target.value)} placeholder='Item'/>
            <br/>
            <br/>
            <input value={dataObjectClass} onChange={(objectClass) =>setDataObjectClass(objectClass.target.value)} placeholder='Object class'/>
            <br/>
            <br/>
            <input value={dataDescription} onChange={(description) =>setDataDescription(description.target.value)} placeholder='Description'/>
            <br/>
            <br/>
            <input value={dataContainment} onChange={(containment) =>setDataContainment(containment.target.value)} placeholder='Containment'/>
            <br/>
            <br/>
            <input type = "file" onChange={handleImageChange}/>
            {" "}
            <button onClick={uploadImage}>Upload Image</button>
            <br/>
            {imageURL && <img src={imageURL} alt="Uploaded Preview" style={{maxWidth: "200px", height: "auto"}}/>}
            <br/><br/>
            {!showDoc?<button onClick={crudCreate}>Create new document</button>:
            <button onClick={crudUpdate}>Update document</button>}
            </div>
            <br/>
            <hr/>
            
            {
                readData.map(
                    values=>(
                        <div  key={values.id}>
                            <div className="component container content">
                            <h2>{values.item}</h2>
                            <p><strong>Object Class:</strong>{values.objectClass}</p>
                            <p><strong>Description:</strong>{values.description}</p>
                            <p><strong>Containment:</strong>{values.containment}</p>
                            <p style={{textAlign:'center'}}>{values.imageURL && <img src={values.imageURL}style={{maxWidth: "200px", height: "auto"}}alt=""/>}</p>
                            <button onClick={()=>crudDelete(values.id)}>Delete</button>
                            {" "}
                            <button onClick={()=>showEdit(values.id,values.item,values.objectClass,values.description,values.containment,values.imageURL)}>Edit</button>
                            </div>
                        </div>
                    )
                )
            }
        </>
    )
}

export default CRUD