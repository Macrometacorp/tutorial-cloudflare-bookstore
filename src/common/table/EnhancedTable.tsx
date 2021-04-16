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
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    // onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" id={`table-row-header`}></TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            style={{ fontWeight: "bold", fontSize: "16px" }}
            id={`table-row-header-${index}`}
          >
            {headCell.label}
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
    <Toolbar className={clsx(classes.root)} id={"table-toolbar-heading"}>
      <Typography
        className={classes.title}
        variant="h5"
        id="table-toolbar-heading-title"
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
};
export default function EnhancedTable(props: EnhancedTableDataProps) {
  const classes = useStyles();
  // const [order, setOrder] = useState<Order>("desc");
  const { networkapis } = props;
  // const [orderBy, setOrderBy] = useState<keyof Data>("Path");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <div className={classes.root} id="paper-id">
      <Paper className={classes.paper}>
        <EnhancedTableToolbar tableHeading={props.tableHeading} />
        {networkapis && networkapis.length > 0 ? (
          <div id="table-header-id-anurag">
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="table-toolbar-heading-title"
                size={"small"}
                aria-label="enhanced table"
                id={"table-row-id"}
              >
                <EnhancedTableHead classes={classes} />
                <TableBody>
                  {networkapis
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover key={row.Path}>
                          <TableCell id={`table-row-id`}></TableCell>
                          <TableCell
                            style={{ fontSize: "14px" }}
                            align="left"
                            id={`table-row-id-path`}
                          >
                            {row.Path}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: "14px" }}
                            align="left"
                            id={`table-row-id-status`}
                          >
                            {row.Status}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: "14px" }}
                            align="left"
                            id={`table-row-id-method`}
                          >
                            {row.Method}
                          </TableCell>
                          <TableCell
                            style={{ fontSize: "14px" }}
                            align="left"
                            id={`table-row-id-size`}
                          >
                            {row.URL}
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "14px",
                              fontWeight: "bolder",
                            }}
                            align="left"
                            id={`table-row-id-time`}
                          >
                            {row.Time}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <Grid
                container
                item
                justify="flex-end"
                sm={12}
                className={classes.gridStyle}
                id={"table-row-id-grid"}
              >
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={networkapis ? networkapis.length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Grid>
            </TableContainer>
          </div>
        ) : (
          <p>No Data to Display</p>
        )}
      </Paper>
    </div>
  );
}
