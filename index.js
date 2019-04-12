/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(document).ready( function () {
  var Category;
  var dataTable = $('#samples').DataTable({
    'initComplete': function(settings, json){
      stuff(settings, json);
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
        data: '',
        defaultContent: '0',
        visible: false
      },
      {
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
        'visible': false,
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
      action: function (e, dt, node, conf) {
        var rowSelector = [ '#sampleid_10', '#sampleid_2', '#sampleid_401'  ];
        var row1 = dataTable.rows(rowSelector);
        var data1 = row1.data();
        console.log(data1);
        alert('This button will automatically check all rows that match predefined list 1 using the hidden ID column.');
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

  function stuff(settings, json){
    //grab all the unique sorted data entries from the necessary row
    Category = dataTable.column(6).data().unique().sort();

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

    dataTable.on('select', function (e, dt, type) {
      if (type === 'row') {
        var row = dataTable.row(dt);
        $(row.node()).find('td:eq(4)').html(
          '<select id="ID">' + Category.reduce((options, item) =>
            options += `<option value="${item}" ${
              item == row.data().Category ? 'selected' : ''}>${
              item}</option>`, '') + '</select>'
        );
        toggleDataAndDraw(row, type, '1');
      }

      $('#ID').on('change', function () {
        var optionSelected = $('option:selected', this);
        var valueSelected = this.value;
        var row = $(this).closest('tr');

        var cell = dataTable.cell(row, 6);
        cell.data(valueSelected);
      });
    });

    dataTable.on('deselect', function (e, dt, type) {
      if (type === 'row') {
        var row = dataTable.row(dt);
        writeCell($(row.node()).find('select'));
        toggleDataAndDraw(row, type, '0');
      }
    });

    var toggleDataAndDraw = (row, type, dataVal) => {
      if (type === 'row') {
        dataTable.cell({
          row: row.index(),
          column: 0
        }).data(dataVal);
        dataTable.draw();
      }
    };
  }
});
