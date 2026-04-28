import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const documents = [
  { name: "PAN Card", status: "Verified" },
  { name: "Salary Slip", status: "Pending" },
  { name: "Bank Statement", status: "Rejected" }
];

function DocumentAction() {
  return (
    <>
      <h5>Document Management</h5>

      <Table bordered>
        <thead>
          <tr>
            <th>Document</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc, index) => (
            <tr key={index}>
              <td>{doc.name}</td>
              <td>
                <Badge bg={
                  doc.status === "Verified"
                    ? "success"
                    : doc.status === "Pending"
                    ? "warning"
                    : "danger"
                }>
                  {doc.status}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="primary">
                  Upload
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default DocumentAction;