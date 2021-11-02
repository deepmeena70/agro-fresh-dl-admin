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
import ChipInput from 'material-ui-chip-input'


import firebase from '../../firebase'
import {useDispatch, useSelector} from 'react-redux';
import {addProducts, productsSelector} from '../../features/products'


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

export default function NewFreshBasket() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [bucketItems, setBucketItems] = useState([]);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);

    setProductName('Fresh Basket');
    setBucketItems([]);
  };

  const handleSave = (e) => {

    if(!productName
        && !sellingPrice
      ) {
        return console.log("cannot left blank")
      }

    handleClose();

    const data = {
      productName,
      sellingPrice,
      bucketItems,
      productCategory: "freshBasket",
      created: firebase.firestore.FieldValue.serverTimestamp(),
      modified: firebase.firestore.FieldValue.serverTimestamp()
    }

    firebase.firestore().collection('freshBasket').doc().set(data)
      .then(dispatch(addProducts(productName)));
    
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (chip) => {
    console.log(chip);
    setBucketItems(chip);
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
                <TextField id="filled-basic" label="Fresh Basket" variant="outlined" fullWidth value={productName} onChange={e=>setProductName(e.target.value)}/>
            </Grid>
            <Grid 
              item
              xs={4}            
              >
                <TextField id="filled-basic" label="Bucket Price (₹)" variant="outlined" fullWidth value={sellingPrice} onChange={e=>setSellingPrice(e.target.value)}/>
            </Grid>
                
          </Grid>
  
          <Grid item xs={12}>
            <ChipInput
              defaultValue={[]}
              onChange={(chips)=>handleChange(chips)}
              fullWidth
              placeholder="Add Bucket Items"
            />
          </Grid>
          <Grid
              item
            >
      
            </Grid>
            <Grid
              item
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
