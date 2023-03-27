import React, { Component } from "react";
import "./styles/Section.css";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faPlus,
	faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
import astronaut from "./user-astronaut-solid.svg";

class Section extends Component {
	constructor(props) {
		super(props);
		this.state = {
			action: "Save",
			personalImage: astronaut
		};
	}

	onSubmitSection = e => {
		const { stateName, editableFields, updateMethod, fromToFields } =
			this.props;
		e.preventDefault();
		let stateUpdate = {};
		stateUpdate[stateName] = [];
		e.target.querySelectorAll("form>div").forEach(div => {
			let field;
			const info = div.children[1].value;
			if (editableFields === "true") {
				field = div.children[0].value;
			} else if (editableFields === "false") {
				field = div.children[0].textContent;
			}
			if (fromToFields === "false") {
				if (field !== "" || info !== "") {
					stateUpdate[stateName].push({
						id: uniqid(),
						field: field,
						info: info
					});
				}
			} else if (fromToFields === "true") {
				const from = div.querySelector("#from").value;
				const to = div.querySelector("#to").value;
				if (field !== "" || info !== "" || from !== "" || to !== "") {
					stateUpdate[stateName].push({
						id: uniqid(),
						field: field,
						info: info,
						from: from,
						to: to
					});
				}
			}
		});
		updateMethod(stateUpdate);
		this.setState({ action: "Edit" });
	};

	edit = () => {
		this.setState({ action: "Save" });
	};

	fileUploaded = file => {
		console.log("fileUploaded", file);
		this.setState({personalImage: URL.createObjectURL(file)});
	};

	onPhotoClick = e => {
		document.getElementById("fileInput").click();
	};

	render() {
		const {
			stateName,
			heading,
			singular,
			editableFields,
			icons,
			addItemMethod,
			fromToFields,
			sectionState
		} = this.props;

		let singularOtherInfo = null;
		if (singular !== "null") {
			singularOtherInfo = (
				<div>
					<div>{singular}</div>
					<div>Información Adicional</div>
				</div>
			);
		}

		let sectionRender;
		if (this.state.action === "Save") {
			let addItemButton = null;
			if (addItemMethod !== "null") {
				addItemButton = (
					<button
						type="button"
						onClick={() => {
							addItemMethod(stateName);
						}}
					>
						<FontAwesomeIcon icon={faPlus} className="icon" />
						<div>Agregar {singular}</div>
					</button>
				);
			}
			const formClass = `editableFields-${editableFields}`;
			sectionRender = (
				<div>
					<form
						onSubmit={this.onSubmitSection}
						autoComplete="on"
						className={formClass}
					>
						{sectionState.map((item, index) => {
							let inputInfo = <input type="text" defaultValue={item.info} />;
							let inputOrDiv;
							let notEditableClass = null;
							if (item.field === "image") {
								notEditableClass = `notEditable${index}`;
								inputOrDiv = (
									<input
										type="file"
										id="fileInput"
										accept="image/*"
										style={{ display: "none" }}
										onChange={e => this.fileUploaded(e.target.files[0])}
									/>
								);
								inputInfo = (
									<img
										src={this.state.personalImage}
										alt="Foto"
										onClick={this.onPhotoClick}
										onDragEnter={e => {
											e.stopPropagation();
											e.preventDefault();
										}}
										onDragOver={e => {
											e.stopPropagation();
											e.preventDefault();
										}}
										onDrop={e => {
											e.stopPropagation();
											e.preventDefault();
											const fileObj = e.dataTransfer.files[0];
											this.fileUploaded(fileObj);
										}}
									/>
								);
							} else if (editableFields === "true") {
								inputOrDiv = <input type="text" defaultValue={item.field} />;
							} else if (editableFields === "false") {
								notEditableClass = `notEditable${index}`;
								inputOrDiv = <div>{item.field}</div>;
							}
							let fromToInputs = null;
							if (fromToFields === "true") {
								fromToInputs = (
									<div className="fromTo">
										<label htmlFor="from">Desde</label>
										<input type="text" id="from" defaultValue={item.from} />
										<label htmlFor="to">Hasta</label>
										<input type="text" id="to" defaultValue={item.to} />
									</div>
								);
							}
							return (
								<div key={item.id} className={notEditableClass}>
									{inputOrDiv}
									{inputInfo}
									{fromToInputs}
								</div>
							);
						})}

						{addItemButton}
						<button type="submit">
							<FontAwesomeIcon icon={faCheck} className="icon" />
							<div className="pipe">&nbsp;</div>
							<div>Guardar</div>
						</button>
					</form>
				</div>
			);
		} else if (this.state.action === "Edit") {
			sectionRender = (
				<div>
					{sectionState.map(item => {
						let divOrIcon;
						if (icons === "null" || !icons.hasOwnProperty(item.field)) {
							divOrIcon = <div>{item.field}</div>;
						} else if (icons !== "null" && icons.hasOwnProperty(item.field)) {
							divOrIcon = (
								<div className="field">
									<FontAwesomeIcon icon={icons[item.field]} />
								</div>
							);
						}
						return (
							<div key={item.id} className="item">
								{divOrIcon}
								<div className="info">{item.info}</div>
								<div>{item.from}</div>
								<div>{item.to}</div>
							</div>
						);
					})}
					<button onClick={this.edit}>
						<FontAwesomeIcon icon={faPenToSquare} className="icon" />
						<div>Editar</div>
					</button>
				</div>
			);
		}

		return (
			<section className={stateName}>
				<div className="sectionDiv">
					<h2>{heading}</h2>
					{singularOtherInfo}
					{sectionRender}
				</div>
			</section>
		);
	}
}

export default Section;
