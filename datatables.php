<?php

/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simply to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See http://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - http://datatables.net/license_mit
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

// DB table to use
$table = 'sample_info_test';

// Table's primary key
$primaryKey = 'Name';

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
	array( 'db' => 'ID', 'dt' => 1 ),
    array( 'db' => 'Name', 'dt' => 2 ),
    array( 'db' => 'Region', 'dt' => 3 ),
    array( 'db' => 'Class', 'dt' => 4 ),
    array( 'db' => 'Category', 'dt' => 5 ),
    array( 'db' => 'QC_flag','dt' => 7,),
    array('db'  => 'QC_comment','dt' => 6,)
);

// SQL server connection information
$sql_details = array(
    'user' => 'user',
    'pass' => 'pass',
    'db'   => 'test_schema',
    'host' => 'xxx.xx.xxx.xx'
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */

require( 'ssp.class.php' );

echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);
