import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem'
import { AddLogItem } from './AddLogItem'
import { ipcMain, ipcRenderer } from "electron";

const App = () => {

	let dummData = [
		{
			_id: 1,
			text: 'This is log ',
			priority: 'low',
			user: 'Jordi',
			created: new Date().toString()
		},
		{
			_id: 2,
			text: 'This is log ',
			priority: 'high',
			user: 'Denham',
			created: new Date().toString()
		},
		{
			_id: 3,
			text: 'This is log ',
			priority: 'moderate',
			user: 'Josh',
			created: new Date().toString()
		},
	]

	const [logs, setLogs] = useState([])

	const [alert, setAlert] = useState({
		show: false,
		message: "",
		variant: "success"
	})

	useEffect(() => {
		ipcRenderer.send('logs:load')
		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs))
		})
	}, [])

	function addItem(item) {
		if (item.text == "" || item.user == "" || item.priority == "") {
			showAlert("Please enter all fields", 'danger')
			return
		}

		item._id = Math.floor(Math.random() * 90000) + 1000
		item.created = new Date().toString()

		setLogs([...logs, item])
		showAlert("Log added :)")
		console.log(item)
	}

	function deleteItem(_id) {
		setLogs(logs.filter((item) => item._id !== _id))
		showAlert("Log removed ❌", "danger")
	}

	function showAlert(message, variant = 'success', seconds = 3000) {
		setAlert({
			show: true,
			message,
			variant
		})

		setTimeout(() => {
			setAlert({
				show: false,
				message: "",
				variant: "success"
			})
		}, seconds)
	}

	return (
		<div className='app'>
			<Container>
				<AddLogItem addItem={addItem} />
				{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
				<Table>
					<thead>
						<tr>
							<th>Priority</th>
							<th>Log Text</th>
							<th>User</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{
							logs.map((log) => <LogItem log={log} key={log._id} deleteItem={deleteItem} />)
						}
					</tbody>
				</Table>
			</Container>
		</div>
	)
}

export default App
