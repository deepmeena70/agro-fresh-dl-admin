import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import firebase from '../../firebase'

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  input:{
    display:'none'
  },
  paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function NewProduct() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [regular, setRegular] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [vegetable, setVegetable] = useState(false);
  const [fruit, setFruit] = useState(false);
  const [exotic, setExotic] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('')
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);


  const handleOpen = () => {
    setOpen(true);

    setProductName('');
    setQuantity('');
    setSellingPrice('');
    setDiscountPrice('');
    setDescription('');
    setRegular(false);
    setBulk(false);
    setVegetable(false);
    setFruit(false);
    setExotic(false);
    setImageFile(null);
    setImageURL('');
    setUploadProgress(null);
  };

  const handleSave = (e) => {
    handleClose();
    const data = {
      productName,
      quantity,
      sellingPrice,
      discountPrice,
      description,
      regular,
      bulk,
      vegetable,
      fruit,
      exotic,
      imageURL,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      modified: firebase.firestore.FieldValue.serverTimestamp()
    }

    firebase.firestore().collection('products').doc().set(data)
    
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageFile = (e) => {
    setImageFile(e.target.files[0]);
    console.log(imageFile);
  }

  const handleUpload = (e) => {
    // Create the file metadata
    let metadata = {
      contentType: 'image'
    }

    let storageRef = firebase.storage().ref();

    // Upload file and metadata to the object 'images/mountains.jpg'
    let uploadTask = storageRef.child('products/' + imageFile.name).put(imageFile, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setImageUploading(true)
      setUploadProgress(progress);

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      setImageUploading(false);
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        setImageURL(downloadURL);
      });
    }
    );

  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        <Grid
          container
          spacing={2}
        >
          <Grid
            container
            item
            spacing={2}
          >
            <Grid 
              item
              xs={4}            
              >
                <TextField id="filled-basic" label="Product Name" variant="outlined" fullWidth value={productName} onChange={e=>setProductName(e.target.value)}/>
            </Grid>
            <Grid 
              item
              xs={4}
              >
                <TextField id="filled-basic" label="Quantity" variant="outlined" value={quantity} onChange={e=>setQuantity(e.target.value)}fullWidth/>
            </Grid>
            <Grid 
              item
              xs={4}
              >
                <TextField id="filled-basic" label="Selling Price" variant="outlined" value={sellingPrice} onChange={e=>setSellingPrice(e.target.value)} fullWidth/>
            </Grid>
          </Grid>
          <Grid
              item
              container
              spacing={2}
            >
              <Grid 
                item
                xs={3}
              >
                  <TextField id="filled-basic" label="Discount Price" variant="outlined" value={discountPrice} onChange={e=>setDiscountPrice(e.target.value)} fullWidth/>
              </Grid>
              <Grid 
                item
                xs={9}
              >
                  <TextField id="filled-basic" label="Description" variant="outlined" value={description} onChange={e=>setDescription(e.target.value)}fullWidth/>
              </Grid>
          </Grid>
          <Grid
              item
            >
              <FormGroup
                aria-label="position"
                row
              >
                    <FormControlLabel
                      value="start"
                      control={<Checkbox color="primary"/>}
                      label="Regular"
                      labelPlacement="start"
                      checked={regular} 
                      onChange={e=>setRegular(e.target.checked)}
                    />
                    <FormControlLabel
                      value="start"
                      control={<Checkbox color="primary" />}
                      label="Bulk"
                      labelPlacement="start"
                      checked={bulk}
                      onChange={e=>setBulk(e.target.checked)}
                    />
                    <FormControlLabel
                      value="start"
                      control={<Checkbox color="primary" />}
                      label="Vegetable"
                      labelPlacement="start"
                      checked={vegetable}
                      onChange={e=>setVegetable(e.target.checked)}
                    />
                    <FormControlLabel
                      value="start"
                      control={<Checkbox color="primary" />}
                      label="Fruit"
                      labelPlacement="start"
                      checked={fruit}
                      onChange={e=>setFruit(e.target.checked)}
                    />
                    <FormControlLabel
                      value="start"
                      control={<Checkbox color="primary" />}
                      label="Exotic"
                      labelPlacement="start"
                      checked={exotic}
                      onChange={e=>setExotic(e.target.checked)}
                    />
              </FormGroup>
            </Grid>
            <Grid
              item
              container
              spacing={2}
            >
              <Grid
                item
                xs={2}
              >
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleImageFile}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="default" component="span">
                    Browse
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={1}
              >
                <Button variant="contained" color="primary" onClick={handleUpload}>
                  <CloudUploadIcon/>
                </Button>
              </Grid>
              <Grid
                item
              >
                <div style={{ marginLeft:18, marginTop:6 }}>
                  {imageFile && imageFile.name}
                </div>
              </Grid>
              <Grid
                item
              >
                <div style={{ marginLeft:18, marginTop:6 }}>
                  {imageUploading && 'uploading...'}
                </div>
              </Grid>
              <Grid
                item
              >
                <div style={{ marginLeft:18, marginTop:6 }}>
                  {uploadProgress && `${uploadProgress} %` }
                </div>
              </Grid>
              <Grid
                container
                item
                spacing={2}
              >
                <Grid
                  item
                  xs={4}
                >
                </Grid>
                <Grid
                  item
                  xs={2}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >Cancel</Button>
                </Grid>
                <Grid
                  item
                  xs={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >Save</Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                >
                </Grid>

              </Grid>

            </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}
        style={{ marginBottom:20 }}
      >
        New
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
