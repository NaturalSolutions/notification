var React = require('react');
import {AgGridReact} from 'ag-grid-react';
import axios from 'axios';

class GenGrille extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
			showGrid: true,
			dataRow : [],
			dataCol :[],
			quickFilterText: null,
			rowHeight : 30
		}
		 this.transformerCol = this.transformerCol.bind(this)
		 this.sizeToFit = this.sizeToFit.bind(this)

		this.gridOptions = {
		// this is how you listen for events using gridOptions
			onModelUpdated () {
			  console.log('event onModelUpdated received');
			},
			rowHeight: 30,
			onRowClicked: (row) => {
			console.log("on va rediriger vers une vue details")
			this.setState({rowHeight : 350})
			console.log(row.data.ID)
				let dataResponse = []

				axios.get('http://127.0.0.1:6544/alerting-core/details/'+row.data.ID )
				.then( function (response) {
						this.setState ( {dataRow : response.data  } )
						this.transformerCol(this.state.dataRow[0])
						
						console.log("hauteur" + this.state.rowHeight)
						this.sizeToFit()
						this.state.dataCol.ID.width =30;

				}.bind(this))
				.catch(function (response){
						console.log(response)
					}) 


			},
			// this is a simple property
			rowBuffer: 10, // no need to set this, the default is fine for almost all scenarios
			enableFilter : true
		};


		


		var resizeGrid = () => {
			this.gridOptions.api.sizeColumnsToFit()
			}	
		}

		onQuickFilterText(event) {
			console.log("filtre :"+event.target.value)
			this.setState({quickFilterText: event.target.value});
		}

	sizeToFit() {
    this.gridOptions.api.sizeColumnsToFit();
		}

	componentDidMount() {
		window.addEventListener('resize',this.sizeToFit)
		let dataResponse = []

		axios.get('http://127.0.0.1:6544/alerting-core/infos' )
		.then( function (response) {
				this.setState ( {dataRow : response.data  } )
				console.log("avant transform")
				console.log(this.state.dataRow[0])
				console.log(response.data[0])
				this.transformerCol(this.state.dataRow[0])
				this.setState({rowHeight : 30})
				this.sizeToFit()
		}.bind(this))
		.catch(function (response){
				console.log(response)
			}) 
		}
/* 
  prend en entré un json 
  se sert des cles ( { key : val } )
  generer les headers du tableau de la forme ( { headerNale : key , filed : key , witdh : nb_pixel })
  */

		transformerCol(JsonObjet){
				var colAutoGen = []
				console.log(JsonObjet)
				for(var champ in JsonObjet){
					console.log("champ :" , champ)
					if( champ === 'ID' || champ ==='id')
					{
						console.log("on va mettre le champ id")
						colAutoGen.push({
							headerName : champ,
							field: champ,
							width : 30,
							filter: 'text',
	    				filterParams: {apply: true, newRowsAction: 'keep'},
	    				pinned: 'left',
	    				suppressMovable	: true
						})
					}
					else{
							colAutoGen.push({
									headerName : champ,
									field: champ,
									width : 100,
									filter: 'text',
			    				filterParams: {apply: true, newRowsAction: 'keep'},
			    				cellStyle: {
			            'white-space': 'normal',
			            'word-wrap' :'break-word'
			       			 }

									})
						}
				}
		this.setState( {dataCol : colAutoGen} )
		}

	onGridReady(params) {
		this.api = params.api;
		this.columnApi = params.columnApi;
	}


	render () {
		return (
				<div>
				<input type="text" onChange={this.onQuickFilterText.bind(this)} placeholder="Type text to filter..."/>
						<div style={{height: 400}} className="ag-blue">
								<AgGridReact
								gridOptions={this.gridOptions}
								quickFilterText={this.state.quickFilterText}
								onGridReady={this.onGridReady.bind(this)}
								columnDefs = {this.state.dataCol}
								rowData = {this.state.dataRow}
								rowSelection="multiple"
								enableColResize="true"
								enableSorting="true"
								enableFilter="true"
								groupHeaders="true"
								rowHeight={this.state.rowHeight}
								debug="true"
								/>
						</div>
				</div>
		);
	}

}

export default GenGrille;