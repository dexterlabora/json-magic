# Meraki API JSONata Examples

## Device Status - Sort by status
`{{baseUrl}}/organizations/:organizationId/devices/statuses`
```jsonata
$^(status).{
    "serial": serial,
    "status": status
}
```

## Networks - Hyperlinks
`{{baseUrl}}/organizations/:organizationId/networks`
```jsonata
$.{
    "ID": id,
    "Network": "<a href='https://dashboard.meraki.com/network/manage/network_settings/" & id & "'>" & name & "</a>",
    "Products": productTypes
}
```

## Clients - Filter and Transform
`{{baseUrl}}/networks/:networkId/clients`
```jsonata
$[status='Online'].{
    "MAC": mac,
    "IP": ip,
    "Description": description,
    "VLAN": vlan,
    "Usage (MB)": $round(usage.total / (1024 * 1024), 2)
}
```

## Device Inventory - Combine and Group
`{{baseUrl}}/organizations/:organizationId/inventoryDevices`
```jsonata
$group($.{
    "model": model,
    "networkId": networkId
}, function($g) {
    {
        "model": $g.model,
        "networkId": $g.networkId,
        "count": $count($g),
        "serials": $g.serial
    }
})
```

## SSID Settings - Reduce and Transform
`{{baseUrl}}/networks/:networkId/wireless/ssids`
```jsonata
$reduce($[enabled=true], function($acc, $cur) {
    $acc & {
        ($cur.name): {
            "Auth Mode": $cur.authMode,
            "Encryption Mode": $cur.encryptionMode,
            "Admin Status": $cur.enabled ? "Enabled" : "Disabled"
        }
    }
}, {})
```

## Organization Devices - Sort and Limit
`{{baseUrl}}/organizations/:organizationId/devices`
```jsonata
$sort($.{
    "Name": name,
    "Model": model,
    "Serial": serial,
    "MAC": mac
}, function($l, $r) {
    $l.Model > $r.Model
})[1..10]
```

## Switch Ports - Filter and Transform
`{{baseUrl}}/devices/:serial/switch/ports`
```jsonata
$[enabled=true].{
    "Port": portId,
    "Name": name,
    "VLAN": vlan,
    "Type": type,
    "PoE": poeEnabled ? "Enabled" : "Disabled",
    "Status": status
}
```

## Organization Licenses - Aggregate
`{{baseUrl}}/organizations/:organizationId/licenses`
```jsonata
{
    "Total Licenses": $count($),
    "License Types": $distinct($.licenseType),
    "Expiring Soon": $count($[($now() - expirationDate) < 2592000000])
}
```