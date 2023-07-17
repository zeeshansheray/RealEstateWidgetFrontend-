import React from 'react';

export default function SidebarSub({items}) {
    if(!items) return ('')

    return (<div>{items}</div>)
}
