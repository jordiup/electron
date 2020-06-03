import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import LogItem from './LogItem'

const App = () => {

	const [logs, setLogs] = useState([
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
	])

	return (
		<div className='app'>
			<h1>React Electron Boilerplate</h1>
			<p>This is a simple boilerplate for using React with Electron</p>

			<Container>
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
							logs.map((log) => <LogItem log={log} />)
						}
					</tbody>
				</Table>
			</Container>
		</div>
	)
}

export default App
