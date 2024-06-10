import React from 'react';
import "./DownloadedFilesTable.css";

const DowloadedFilesTable = ({data}) => {
  if(!data || data.length===0){
    return <h1 className='noDataFound'>No files downloaded</h1>
  }

  return (
    <table className='filesTable'>
        <thead>
          <tr>
            <th>File Name</th>
            <th>URL</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
           
            return(
            <tr key={item.id}>
              <td className='fileCell' title={item.fileName}>{item.fileName}</td>
              <td className='urlCell'><a href={item.url} title={item.url}>{item.url}</a></td>
              <td>{new Date(item.createdAt).toLocaleString()}</td> 
            </tr>)
          })}
        </tbody>
      </table>
  )
}

export default DowloadedFilesTable;