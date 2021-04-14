import React, { useState } from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Grid, Button, CircularProgress } from "@material-ui/core";
// import SearchBar from "material-ui-search-bar";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingRight: "10px",
      paddingLeft: "10px",
    },
    gridStyle: {
      padding: "10px",
    },
    button: {
      margin: "1px",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

export interface Data {
  Name: string;
  URL: string;
  Path: string;
  Status: string;
  Time: string;
  Method: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | null },
  b: { [key in Key]: number | string | null }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "Path", numeric: false, disablePadding: false, label: "Path" },
  { id: "Status", numeric: false, disablePadding: false, label: "Status" },
  { id: "Method", numeric: false, disablePadding: false, label: "Method" },
  { id: "URL", numeric: false, disablePadding: false, label: "Size" },
  {
    id: "Time",
    numeric: false,
    disablePadding: false,
    label: "Time",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;

  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;

  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              style={{ fontWeight: "bold", fontSize: "16px" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(4),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

const EnhancedTableToolbar = (props: { tableHeading: string }) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar className={clsx(classes.root)}>
      <Typography
        className={classes.title}
        variant="h5"
        id="tableTitle"
        component="div"
        style={{ fontWeight: "bold", textAlign: "center" }}
      >
        {props.tableHeading}
      </Typography>
    </Toolbar>
  );
};
type EnhancedTableDataProps = {
  networkapis: Data[];
  tableHeading: string;
  showBulkUploadButton?: boolean;
  handleBulkUpload: Function;
  loading: boolean;
  showSearch: boolean;
  handleSetRows: Function;
  originalnetworkapis?: Data[];
};
export default function EnhancedTable(props: EnhancedTableDataProps) {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>("asc");
  const [searched, setSearched] = useState<string>("");
  const { networkapis, originalnetworkapis, handleSetRows } = props;
  const [orderBy, setOrderBy] = useState<keyof Data>("Path");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const requestSearch = (searchedVal: string) => {
    const filteredRows =
      originalnetworkapis &&
      originalnetworkapis.filter((row) => {
        if (row.Path !== null) {
          return row!.Path.toLowerCase().includes(searchedVal.toLowerCase());
        }
        return row;
      });
    handleSetRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar tableHeading={props.tableHeading} />
        {networkapis && networkapis.length > 0 ? (
          <>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"small"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {networkapis &&
                    networkapis.length > 0 &&
                    stableSort(networkapis, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow hover key={row.Path}>
                            <TableCell></TableCell>
                            <TableCell
                              style={{ fontSize: "14px" }}
                              align="left"
                            >
                              {row.Path}
                            </TableCell>
                            <TableCell
                              style={{ fontSize: "14px" }}
                              align="left"
                            >
                              {row.Status}
                            </TableCell>
                            <TableCell
                              style={{ fontSize: "14px" }}
                              align="left"
                            >
                              {row.Method}
                            </TableCell>
                            <TableCell
                              style={{ fontSize: "14px" }}
                              align="left"
                            >
                              {row.URL}
                            </TableCell>
                            <TableCell
                              style={{ fontSize: "14px", fontWeight: "bolder" }}
                              align="left"
                            >
                              {row.Time}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              container
              item
              justify="flex-end"
              sm={props.showBulkUploadButton ? 6 : 12}
              className={classes.gridStyle}
            >
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={networkapis && networkapis.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                style={{ fontSize: "20px" }}
              />
            </Grid>
          </>
        ) : (
          <p>No Data to Display</p>
        )}
      </Paper>
    </div>
  );
}
