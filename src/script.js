const dataURLBase = 'https://docs.google.com/spreadsheets/d/';
const dataURLEnd = '/gviz/tq?tqx=out:json&tq&gid=';
const id = '1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE';
const gids = ['0', '1574569648', '1605451198'];

//Fetching the data
const getDatabaseData=async(gid)=>{
   try{
      const response= await fetch(`${dataURLBase}${dataURLEnd}${id}${gid}`)
      const data=await response.text();
      data=data.substring(47,data.length-2)
      data=JSON.parse(data)
      return data
   }
   catch(err){
      console.log(err.message)
   }
}

let tableData=[]

const getAllDatabaseData=async (gid)=>{
   try{
      tableData.names=await fetch(getDatabaseData(gid[0]))
      tableData.hire=await fetch(getDatabaseData(gid[1]))
      tableData.salary=await fetch(getDatabaseData(gid[2]))
      createTable(tableData)
   }
   catch(err){
      console.log(err);
   }
}
//Creating the table components
const labelForTable={
   first:[],
   last:[],
   salary:[],
   hire:[],
   data:[],
}

//Adding the data:
const createTable=(tableData)=>{
   labelForTable.first=tableData.names.table.rows[0].c[0].v.replace(
      'first','First'
   )
   labelForTable.last=tableData.names.table.rows[0].c[1].v.replace(
      'last','Last'
   )
   labelForTable.salary=tableData.salary.table.cols[0].label.replace(
      'salary','Salary'
   )
   labelForTable.hire=tableData.hire.table.cols[0].label.replace(
      'hire','Hire'
      .replace('data','Date')
   )
}

//Creating the table:
let table=$('#employees')
table.addClass('table table-stripped').bootstrapTable({
   columns:[
      {
         field:'last',
         title:labelForTable.last,
         sortable:true,
         sorter:(a,b,c,d)=>{
            if(a===b){
               a=c.first
               b=d.first
            }
            if(a>b){
               return 1
            }
            return -1
         }
      },

      {
         field:'last',
         title:labelForTable.last,
         sortable:true,
      },

      {
         field:'hire',
         title:labelForTable.hire,
         sortable:true,
         sorter:(a,b)=>{
            return new Date(a).getTime()-new Date(b).getTime()
         },
         formatter:(value)=>{
            return int1.DateTimeFormat('en-eu',{
               year:'numeric',
               month:'short',
               day:'2-digit',
            }).format(value)
         },
      },

      {
         field:'salary',
         title:labelForTable.salary,
         sortable:true,
         sorter:(a,b)=>{
            return a-b
         },
         formatter:(value)=>{
            return int1.NumberFormat('en-us',{
               style:'currency',
               currency:'USD',
            }).format(value)
         }
      }
   ]
})

let data={
   last:[],
   first:[],
   salary:[],
   hire:[],
}

tableData.names.table.rows.map((row,i)=>{
   {row.c[1].v==='last' && data.last}
   data.last.push(row.c[1].v)
   data.first.push(roq.c[0].v)
})

tableData.salary.table.rows.map((row,i)=>{
   data.salary.push(tableData.salary.table.rows[i].c[0].v)
})

tableData.hire.table.rows.map((row,i)=>{
   row.c[0].f=Date.parse(row.c[0].f)
   data.hire.push(tableData.hire.table.rows[i].c[0].f)
})

data.last.map((row,i)=>{
   table.bootstrapTable('append',{
      last:data.last[i],
      first:data.first[i],
      hire:data.hire[i],
      salary:data.salary[i],
   })
})

getAllDatabaseData(gids)