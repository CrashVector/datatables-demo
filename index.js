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
        visible: true
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
        'visible': true,
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
    dom: 'Bfrtip',
    buttons: [{
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
    },
    {
      text: 'Use Selected Library',
      action: function (e, dt, node, config) {
        alert('This buton needs to pass the Sample Name and Category columns to php.');
      }

    },
    {
      text: 'Upload Predefined Library',
      action: function (e, dt, node, conf) {
        alert('This button needs to allow a csv file to be uploaded and passed to php.');
      }
    },
    {
      text: 'Select Default Library 1',
      action: function (dt) {
        defaultselect1 (dt);
     }
    },
    {
      text: 'Select Default Library 2',
      action: function (e, dt, node, conf) {
        alert('This button will automatically check all rows that match predefined list 2 using the hidden ID column.');
      }
    }
    ]
  });

  
//This function adds all the unique entries from the category 
//column into a variabl AFTER the table load is complete

  function categoryFill(settings, json){
  Category = dataTable.column(6).data().unique().sort();
  };
  
  
  
//This function selects all the rows in the rowSelector1 variable when the
//default library 1 button is clicked
  //PROBLEM: Doesn't trigger datatTable.on select routine, and errors saying
  //that Cannot read property 'Category' of undefined .....needs .dt?
  defaultselect1 = function(dt){
        var rowSelector1 = [ '#sampleid_10', '#sampleid_2', '#sampleid_401'  ];
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
    currentRow.remove();
    dataTable.row.add(rowData).draw();
  };

  
  
  
  //triggers on select/deselect to move selected rows to top of table and
  //add dropdown menu for Category column
    //I don't understand how the select id = 'test' and '#test' pieces work. Should they
    //be associated with the row #id?
    // deselecting a row where the category column has been changed triggers errors
  dataTable
  
    .on('select', function (e, dt, type) {
    if (type === 'row') {
      var row = dataTable.row(dt);
      $(row.node()).find('td:eq(6)').html(
        '<select id="test">' + Category.reduce((options, item) =>
          options += `<option value="${item}" ${
            item == row.data().Category ? 'selected' : ''}>${
            item}</option>`, '') + '</select>'
          );
     
          toggleDataAndDraw(row, type, '1');
          }
    
    
        $('#test').on('change', function () {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        var row = $(this).closest('tr');
        var cell = dataTable.cell(row, 6);
        cell.data(valueSelected)
          })
    
        })
    .on('deselect', function (e, dt, type) {
    if (type === 'row') {
      var row = dataTable.row(dt);
      writeCell($(row.node()).find('select'));
      toggleDataAndDraw(row, type, '0');
    }
  });
  
 
 //This function is called to write the check-uncheck value and redraw the table
  //What is the row.index, and should/can the row #id be used instead?
  var toggleDataAndDraw = (row, type, dataVal) => {
    if (type === 'row') {
      dataTable.cell({
        row: row.index(),
        column: 0,
        visible: false
      }).data(dataVal);
      dataTable.draw();
    }
    
   
    
  };
});
