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
        'visible': false, //will be false in final version
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
      [5, 'asc'],
      [6, 'asc'],
      [4, 'asc']
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

  function categoryFill(settings, json){
    Category = dataTable.column(6).data().unique().sort();
  }
  
  //This function deselects all rows
  deselectAll = function (dt){
                    dataTable.rows({selected:true}).deselect()
                    //dataTable.rows().deselect()
  };

  //These functions select all the rows in the rowSelector variable (via the unique rowId)
 defaultselect1 = function(dt){
    var rowSelector1 = [ '#sampleid_10', '#sampleid_2', '#sampleid_401', 
                            '#sampleid_17', '#sampleid_32', '#sampleid_316', '#sampleid_99', 
                            '#sampleid_104', '#sampleid_105', '#sampleid_77', '#sampleid_208'];
    dataTable.rows(rowSelector1).select().order([5, 'asc'],[6, 'asc'],[4, 'asc']).draw();
   
  };
  
  defaultselect2 = function(dt){
    var rowSelector2 = [ '#sampleid_37', '#sampleid_404', '#sampleid_401', 
                            '#sampleid_222', '#sampleid_132', '#sampleid_116', '#sampleid_199', 
                            '#sampleid_4', '#sampleid_5', '#sampleid_277', '#sampleid_308'];
    dataTable.rows(rowSelector2).select().order([5, 'asc'],[6, 'asc'],[4, 'asc']).draw();
  };

  
  //Drop down menu stop event propagation (stops dropdown from closing as soon as you click on it)
  $('#samples').on('click', 'tbody td select',
    event => event.stopPropagation());

  
 //Write dropdown value into table
  var writeCell = dropdown => {
    var currentRow = dataTable.row(dropdown.closest('tr'));
    var rowData = currentRow.data();
    rowData.Category = dropdown.val();
    $(currentRow.node()).find('td:eq(6)').html(
      currentRow.data().Category
    );
    currentRow.draw();
  };
  

  //triggers on select/deselect to move selected rows to top of table and
  //add dropdown menu for Category column
  
  dataTable.on('select', function (e, dt, type) {
      console.log('select', dt[0].length)
      var dt_indexes = dt[0]  //Need to access dt[0] to get row indexes
      if (type === 'row') {
      // Loop through each selectes row
      $.each( dt_indexes, function ( index ) {

      var row = dataTable.row( dt_indexes[index] );
      // Guard clause to check the row length, return if falsey
      if (!row.length) {
        return;
      }
      $(row.node()).find('td:eq(4)').html(
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
        console.log('toggle')
      toggleDataAndDraw(row, type, 1);
    });
      }
    dataTable.draw();
        
    
  //Deselect doesn't hide the Category dropdown. Needs to write current value to table.
  }).on('deselect', function (e, dt, type) {
     console.log('deselect', dt[0].length)
    var dt_indexes = dt[0]  //Need to access dt[0] to get row indexes
    if (type === 'row') {
      //for (i=0; i < dt_indexes.length; i++) {
      //var row = dataTable.row(dt_indexes[i]); 
      $.each( dt_indexes, function ( index ) {
        var row = dataTable.row( dt_indexes[index] );
        
        //use the guard statement again to fix error when deselecting cells 
        //that have the category value set?
     
        //if Category isn't defined, set Category to current row/column 6 value and writeCell
        //else if Category is defined, writeCell
      
        writeCell($(row.node()).find('select'));
        
      
        
        toggleDataAndDraw(row, type, 0); 
      
        
      
     } );     
    }
    dataTable.draw();
  });

  //This function is called to write the check-uncheck value and redraw the table
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
