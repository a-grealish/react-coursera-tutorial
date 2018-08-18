import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader,
		Row, Col, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggle = this.toggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleSubmit(values) {
		this.toggle();
		this.props.addComment(this.props.dishId, values.rating, values.name, values.comment);
	}

	render() {
		return (
			<div>
				<Button onClick={this.toggle} outline color="secondary">
					<span className="fa fa-pencil"></span> Submit Comments
				</Button>

				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className="form-group">
								<Label htmlFor="rating" md={2}>Rating</Label>
								<Col md={10}>
									<Control.select
										model=".rating"
										name="rating">
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Control.select>
									<Errors model=".rating"/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="name" md={2}>Your Name</Label>
								<Col md={10}>
									<Control.text
										model=".name"
										id="name"
										name="name"
										placeholder="Your Name"
										className="form-control"
										validators={{
											required, minLength: minLength(3), maxLength: maxLength(15)
										}}/>
									<Errors 
										className="text-danger"
										model=".name"
										show="touched"
										messages={{
											required: 'Required',
											minLength: 'Must be greater than 2 characters',
											maxLength: 'Must be 15 characters or less'
										}}/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="comment" md={2}>Your comment</Label>
								<Col md={10}>
									<Control.textarea 
										model=".comment"
										id="comment"
										name="comment" 
										placeholder="Your comment"
										rows="8"
										className="form-control"
										validators={{
											required, minLength: minLength(2)
										}} />
									<Errors
										className="text-danger"
										model=".comment"
                                        show="touched"
										messages={{
											required: 'You must write a comment',
											minLength: 'Your comment must have at least two characters'
										}} />
								</Col>
							</Row>
							<Row className="form-group">
								<Col md={{size:10, offset: 2}}>
									<Button type="submit" color="primary">
										Send Feedback
									</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</div>
		)
	}
}

function RenderDish({dish}) {
	return (
		<div className="col-12 col-md-5 m-1">
			<Card>
				<CardImg width="100%" src={dish.image} alt={dish.name} />
				<CardBody>
					<CardTitle>{dish.name}</CardTitle>
					<CardText>{dish.description}</CardText>
				</CardBody>
			</Card>
		</div>
	)
}

function RenderComments({comments, addComment, dishId}) {
	if (comments != null) {
		const commentsList = comments.map((comment) => {
			return (
				<li key={comment.id}>
					<p>{comment.comment}</p>
					<p>-- {comment.author}, {new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date))) }</p>
				</li>
			)
		});

		return (
			<div className="col-12 col-md-5 m-1">
				<h4>Comments</h4>
				<ul className="list-unstyled">
					{commentsList}
				</ul>
				<CommentForm dishId={dishId} addComment={addComment} />
			</div>
		)
	} else {
		return(<div></div>);			
	}

}

const DishDetail = (props) =>  {
	
	if (props.dish != null) {
		return (
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className="col-12">
						<h3>{props.dish.name}</h3>
					</div>
				</div>
				<div className="row">
					<RenderDish dish={props.dish} />
					<RenderComments comments={props.comments} 
						addComment={props.addComment}
						dishId={props.dish.id} />
				</div>
			</div>
		);
	} else {
		return (
			<div className="row"></div>
		);
	}
}

export default DishDetail;
