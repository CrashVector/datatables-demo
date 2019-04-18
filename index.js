/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(document).ready( function () {
  var Category;
  var dataTable = $('#samples').DataTable({

    //Stops the Category variable from being filled until the table has loaded
    'initComplete': function(settings, json){
      categoryFill(settings, json);
    },
    'processing': true,
    'serverSide': false,
    'pageLength': -1,
    'lengthMenu': [
      [100, 250, 500, -1],
      [100, 250, 500, 'All']
    ],
    ajax: {
      url: 'https://api.myjson.com/bins/174mi0',
      dataSrc: ''
    },
    columns: [
      {
        //column to track what is selected and what isn't
        title: 'check-uncheck',
        data: '',
        defaultContent: '0',
        visible: false //will be false in final version
      },
      {
        title: 'checkbox',
        visible: true,
        data: '',
        defaultContent: '',
        orderable: false,
        className: 'select-checkbox',
        targets: 1,
        orderData: [0]
      },
      {
        title: 'ID',
        'className': 'dt-left',
        'visible': true, //will be false in final version
        data: 'ID'
      },
      {
        title: 'Name',
        'className': 'dt-left',
        data: 'Name'
      },
      {
        title: 'Region/Program',
        'className': 'dt-left',
        data: 'Region'
      },
      {
        title: 'Class',
        'className': 'dt-left',
        data: 'Class'
      },
      {
        title: 'Category',
        'className': 'dt-left',
        data: 'Category'
      },
      {
        title: 'QC Concerns',
        'className': 'dt-left',
        data: 'QC_comment'
      }
    ],

    //creates a unique rowId by using the ID column from the database
    rowId: function(a) {
      return 'sampleid_' + a.ID;
    },

    select: {
      style: 'multi',
    },
    order: ([
      [4, 'asc'],
      [5, 'asc'],
      [3, 'asc']
    ]),
    orderFixed: [0, 'desc'],
    dom: '<Bif<t>ilp>',
    buttons: [
      {
        text: 'Select Default Library 1',
        action: function (dt) {
          deselectAll();
          defaultselect1 (dt);
        }
      },
      {
        text: 'Select Default Library 2',
        action: function (dt) {
          deselectAll();
          defaultselect2 (dt);
        }
      },
      {
        text: 'Deselect All',
        action: function (dt) {
          deselectAll (dt);
        }
      },
      {
        extend: 'csv',
        fieldBoundary: '',
        text: '<span class="fa fa-file-excel-o"></span> Download (ALL) or (SELECTED)',
        exportOptions: {
          columns: [6, 3],
          modifier: {
            search: 'applied',
            order: 'applied'
          }
        }
      }
    ]
  });

  //This function adds all the unique entries from the category
  //column into a variabl AFTER the table load is complete

  function categoryFill(settings, json) {
    Category = dataTable.column(6).data().unique().sort();
  }

  //This function deselects all rows
  deselectAll = function (dt){
    dataTable.rows({selected:true}).deselect();
  };

  //These functions select all the rows in the rowSelector variable (via the unique rowId)
  defaultselect1 = function(dt){
    var rowSelector1 = [ '#sampleid_10', '#sampleid_2', '#sampleid_401',
      '#sampleid_17', '#sampleid_32', '#sampleid_316', '#sampleid_99',
      '#sampleid_104', '#sampleid_105', '#sampleid_77', '#sampleid_208'];
    dataTable.rows(rowSelector1).select();
  };

  defaultselect2 = function(dt){
    var rowSelector1 = [ '#sampleid_37', '#sampleid_404', '#sampleid_401',
      '#sampleid_222', '#sampleid_132', '#sampleid_116', '#sampleid_199',
      '#sampleid_4', '#sampleid_5', '#sampleid_277', '#sampleid_308'];
    dataTable.rows(rowSelector1).select();
  };

  //Not sure how the following functions/routines need to be broken out to fix
  //errant behaviors (not selecting, not populating dropdown, deselect causing
  //1 or 0 to be displayed inconsistently, not saving dropdown value when selected,
  //not redrawing table, multiple selection causing dropdown issues, second check-uncheck
  //column being created when deselecting row, etc...)

  //Not sure why this is needed?
  //Drop down menu stop event propagation
  $('#samples').on('click', 'tbody td select',
    event => event.stopPropagation());

  //Write dropdown value into table
  var writeCell = dropdown => {
    var currentRow = dataTable.row(dropdown.closest('tr'));
    var rowData = currentRow.data();
    rowData.Category = dropdown.val();
    $(currentRow.node()).find('td:eq(5)').html(
      currentRow.data().Category
    );
    currentRow.draw();
  };

  //triggers on select/deselect to move selected rows to top of table and
  //add dropdown menu for Category column
  //I don't understand how the select id = 'test' and '#test' pieces work. Should they
  //be associated with the row #id? --OOOHHH, inline HTML, i see)
  // deselecting a row where the category column has been changed triggers errors
  dataTable.on('select', function (e, dt, type) {
    console.log('select', dt[0].length);
    var dt_indexes = dt[0];  //Need to access dt[0] to get row indexes
    if (type === 'row') {
      // Loop through each selectes row
      $.each( dt_indexes, function ( index ) {

        var row = dataTable.row( dt_indexes[index] );
        // Guard clause to check the row length, return if falsey
        if (!row.length) {
          return;
        }
        $(row.node()).find('td:eq(5)').html(
          '<select >' + Category.reduce((options, item) =>
            options += `<option value="${item}" ${
              item == row.data().Category ? 'selected' : ''}>${
              item}</option>`, '') + '</select>'
        ).on('change', function () {
          var optionSelected = $('option:selected', this);
          // changed this.value to optionSelected()
          var valueSelected = $(optionSelected).val();
          var row = $(this).closest('tr');
          var cell = dataTable.cell(row, 6);
          cell.data(valueSelected);
        });
        console.log('toggle');
        toggleDataAndDraw(row, type, 1);
      });
    }
    dataTable.draw();
  }).on('deselect', function (e, dt, type) {
    console.log('deselect', dt[0].length);
    var dt_indexes = dt[0];  //Need to access dt[0] to get row indexes
    if (type === 'row') {
      //for (i=0; i < dt_indexes.length; i++) {
      //var row = dataTable.row(dt_indexes[i]);
      $.each( dt_indexes, function ( index ) {
        var row = dataTable.row( dt_indexes[index] );

        //Somewhere in here needs to be a var that saves the current category for each row to be deselected?
        //that would then be set for those columns/rows. But would also need to function for single manual select/deselects
        //(Or is there an easier way by just hiding the div?)
        //var valuecat =
        //var cell = dataTable.cell(row, 6);
        //cell.data(valuecat);
        // ^ doesn't the call to writeCell below handle this? -- TW

        writeCell($(row.node()).find('select'));
        toggleDataAndDraw(row, type, 0);
      });
    }
    dataTable.draw();
  });

  //This function is called to write the check-uncheck value and redraw the table
  //What is the row.index, and should/can the row #id be used instead?
  var toggleDataAndDraw = (row, type, dataVal) => {
    if (type === 'row') {
      console.log('toggle');
      dataTable.cell({
        row: row.index(),
        column: 0,
        visible: false
      }).data(dataVal);
      //dataTable.draw();
    }
  };
});
