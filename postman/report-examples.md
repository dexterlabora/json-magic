

## Device Status - Sort by status

`{{baseUrl}}/organizations/:organizationId/devices/statuses`

```
$^(status).{
    "serial":serial,
    "status":status
}
```


## Networks - Hyperlinks

`{{baseUrl}}/organizations/:organizationId/networks`

```
$.{
    "ID": id,
    "Network": "<a style='color:blue' href='" & url & "'>" & name & "</a>",
    "Products": productTypes
}
```