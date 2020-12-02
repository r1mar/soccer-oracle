import React from "react";

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: {}
    };

    this.toggleSelection = this.toggleSelection.bind(this);
    this.delete = this.delete.bind(this);
  }

  toggleSelection(event) {
    let newState = {
      selection: Object.assign({}, this.state.selection)
    };

    newState.selection[event.target.id] = {};

    if (
      this.state.selection[event.target.id] &&
      this.state.selection[event.target.id].selected
    ) {
      delete newState.selection[event.target.id];
    } else {
      newState.selection[event.target.id].selected = true;
    }

    this.setState(newState);
  }

  delete() {
    let toDeleteIds = [],
      toDeleteItems = [];

    let keys = Object.keys(this.state.selection);

    keys.forEach(key => {
      if (this.state.selection[key].selected) {
        toDeleteIds.push(+key);
        toDeleteItems.push(this.props.rows.find(item => item.id === +key));
      }
    });

    this.props.delete(toDeleteIds, toDeleteItems).then(() => {
      this.setState({
        selection: {}
      });
    });
  }

  getContent(row, column) {
    let value;

    if (column.type === "date") {
      value = new Date(row[column.name]).toLocaleDateString();
    } else if (typeof column.name === "function") {
      value = column.name(row);
    } else {
      value = row[column.name];
    }

    let content = column.navigation ? (
      <a id={row.id.toString()} onClick={column.navigation} href="#">
        {value}
      </a>
    ) : (
      value
    );

    if (column.name === "id") {
      return (
        <th id={row.id.toString()} scope="row" key={column.id}>
          {content}
        </th>
      );
    } else {
      return (
        <td id={row.id.toString()} key={column.id}>
          {content}
        </td>
      );
    }
  }

  render() {
    let rows = !this.props.rows ? (
      <tr>
        <td colSpan={this.props.columns.length} className="text-center">keine Daten</td>
      </tr>
    ) : (
      this.props.rows &&
      this.props.rows.map(row => {
        let selected =
            this.state.selection[row.id.toString()] &&
            this.state.selection[row.id.toString()].selected,
          attributes = {
            className: selected ? "table-danger" : ""
          };

        let cells =
          this.props.columns &&
          this.props.columns.map(column => this.getContent(row, column));

        return (
          <tr
            {...attributes}
            key={row.id.toString()}
            onClick={this.toggleSelection}
          >
            {cells}
          </tr>
        );
      })
    );
    return (
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th colSpan={this.props.columns.length + 1} className="text-right">
              <button className="btn btn-secondary" onClick={this.props.create}>
                Neu
              </button>
              <button
                className="btn btn-danger"
                onClick={this.delete}
                disabled={Object.keys(this.state.selection).length === 0}
              >
                Löschen
              </button>
            </th>
          </tr>
          <tr>
            {this.props.columns &&
              this.props.columns.map(column => {
                return (
                  <th key={column.id} scope="col">
                    {column.label}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
