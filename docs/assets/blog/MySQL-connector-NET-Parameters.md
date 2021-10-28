---
title: 'MySQL connector .NET : Parameters'
date: 2009-07-20 23:41:56
tags: 
    - C#
    - .NET
    - Parameters
---

最近要在.NET環境下連MySQL資料庫

MySQL提供了MySQL Connector .NET來在.NET環境下連接MySQL

<!-- more -->

不過在使用Parameter的時候有點更改, .NET下要使用 @var 的方式

(以前也是?var, 不過後來改成@var)

不過MySQL Connector .NET必須要設定成 ?var

所以原本的寫法

```csharp
SqlCommand command = new SqlCommand("SELECT * from user WHERE user_name = @id AND user_passwd = @passwd", conn);
command.CommandType = System.Data.CommandType.Text;
command.Parameters.Add("@id", SqlDbType.VarChar, 12).Value = id;
command.Parameters.Add("@passwd", SqlDbType.VarChar, 160).Value = passwd;
command.Prepare();
Console.WriteLine(command.CommandText);
MySqlDataReader reader = command.ExecuteReader();
```

要改成

```csharp
// 要改成?id, ?passwd 
MySqlCommand command = new MySqlCommand("SELECT * from user WHERE user_name = ?id AND user_passwd = ?passwd", conn);
command.CommandType = System.Data.CommandType.Text;
command.Parameters.Add("?id", MySqlDbType.VarChar, 12).Value = id;
command.Parameters.Add("?passwd", MySqlDbType.VarChar, 160).Value = passwd;
command.Prepare();
Console.WriteLine(command.CommandText);
MySqlDataReader reader = command.ExecuteReader();
```

記錄一下