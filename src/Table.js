import React from 'react'
import './Table.css'
import numeral from 'numeral'

function Table({ countries }) {
    return (
        <div className="table">
            {
                countries.map((country, i) => (
                    // <table>
                    //     <tbody>
                            <tr key={i}>
                                <td>{country.country}</td>
                                <td><strong>{numeral(country.cases).format("0,0")}</strong></td>
                            </tr>
                        //</div> </tbody>
                    //</table>
                ))
            }
        </div>
    )
}

export default Table
