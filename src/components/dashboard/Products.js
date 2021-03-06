import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import firebase from '../../firebase'

import NewProduct from './NewProduct'

import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts, deleteProducts, clearProducts, productsSelector} from '../../features/products'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'productName', numeric: false, disablePadding: true, label: 'Product Name' },
  { id: 'imageURL', numeric: false, disablePadding: false, label: 'Image' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity (in Kg)' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'orderType', numeric: false, disablePadding: false, label: 'Order Type' },
  { id: 'sellingPrice', numeric: true, disablePadding: false, label: 'Selling Price (in ???/kg)' },
  { id: 'discountPrice', numeric: true, disablePadding: false, label: 'Discount Price (in ???/kg)' },
  { id: 'packageOf', numeric: true, disablePadding: false, label: 'Packages (in Kg)' },
  { id: 'minOrderQty', numeric: true, disablePadding: false, label: 'Min Order Qty (in Kg)' },
  { id: 'created', numeric: false, disablePadding: false, label: 'Created' },
  { id: 'modified', numeric: false, disablePadding: false, label: 'Modified' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all products' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const deleteData = async (name) => {
  const productRef = firebase.firestore()
  .collection('products');
  const snapshot = await productRef.where('productName', '==' ,name).get();

  if(snapshot.empty) {
    console.log('no match')
    return;
  }

  snapshot.forEach(doc => {
    console.log(doc.data().imageURL);
    try{
      const storageRef = firebase.storage().refFromURL(doc.data().imageURL);
      if(storageRef !== null) {
        storageRef.delete().then(() => {
          console.log('successfully deleted')
        }).catch(err => {
          console.log(err);
        });
      }
    } catch(e) {
      console.log("storage ref err =>", e);
    }
    
    productRef.doc(doc.id).delete()
      .then(() => console.log('deleted'))
      .catch((err) => console.log(err));
  });
}

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selected, setSelected } = props;

  const dispatch = useDispatch();

  const {products, productsLoading } = useSelector(productsSelector);
  
  console.log('num selected =>',numSelected);

  const handleDelete = () => {
    selected.forEach(name=> {
      console.log(name)
      deleteData(name);
      let index = products.findIndex(product => product.productName == name);
      console.log('index of...=>', index);
      dispatch(deleteProducts(name));
    })
    setSelected([]);
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Product List
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function Products() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const dispatch = useDispatch();
  
  const {products, productsLoading } = useSelector(productsSelector);

  console.log(products, productsLoading)

  console.log('products from products =>',products)
  
  useEffect(() => {
      dispatch(clearProducts())
      dispatch(fetchProducts())
  }, [dispatch])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((product) => product.productName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  console.log(selected);

  const time = (seconds, nanoseconds) => {
    if(seconds === null) {
      const date = new Date();
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
    let totalTime = (seconds+nanoseconds*0.00000001)*1000;
    const date =  new Date(totalTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}



  return (
    <div className={classes.root}>
      <NewProduct />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={products.length}
            />
            <TableBody>
              {stableSort(products, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, key) => {
                  const isItemSelected = isSelected(row.productName);
                  const labelId = `enhanced-table-checkbox-${key}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.productName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={key}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.productName}
                      </TableCell>
                      <TableCell align="right">
                        <img src={row.imageURL} style={{ width:60 }}/>
                      </TableCell>
                      <TableCell align="right">
                        {row.description}
                      </TableCell>
                      <TableCell align="right">
                        {row.quantity > 0 ? row.quantity : <div style={{ color:'red' }}>Out of stock</div>}
                      </TableCell>
                      <TableCell align="right">
                        {row.fruit && 'Fruit'}
                        {row.vegetable && 'Vegetable'}
                        {row.exotic && 'Exotic'}
                      </TableCell>
                      <TableCell align="right">
                        {row.bulk && 'Bulk'}
                        {row.regular && 'Regular'}
                      </TableCell>
                      <TableCell align="right">
                        {row.sellingPrice}
                      </TableCell>
                      <TableCell align="right">
                        {row.discountPrice}
                      </TableCell>
                      <TableCell align="right">
                        {String(row.packageOf)}
                      </TableCell>
                      <TableCell align="right">
                        {row.minOrderQty}
                      </TableCell>
                      <TableCell align="right">
                        {row.created&&time(row.created.seconds, row.created.nanoseconds)}
                        {!row.created && time(null)}
                      </TableCell>
                      <TableCell align="right">
                        {row.modified&&time(row.modified.seconds, row.modified.nanoseconds)}
                        {!row.modified&&time(null)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
