---
title: Contact
heading: お問合せ
form:
    action: /home
    name: contact-form
    fields:
        -
            name: name
            label: Name
            placeholder: お名前
            type: text
            validate:
                required: true
        -
            name: email
            label: Email
            placeholder: Email
            type: email
            validate:
                required: true
        -
            name: message
            label: Message
            placeholder: メッセージ
            type: textarea
            rows: 6
            validate:
                required: true
    buttons:
        -
            type: submit
            value: 送信
    process:
        -
            email:
                from: '{{ config.plugins.email.from }}'
                to:
                    - '{{ config.plugins.email.from }}'
                subject: '[Contact] Message from {{ form.value.name|e }}'
                body: '{% include ''forms/data.html.twig'' %}'
        -
            save:
                fileprefix: contact-
                dateformat: Ymd-His-u
                extension: txt
                body: '{% include ''forms/data.txt.twig'' %}'
        -
            display: thank-you
sitemap:
    lastmod: '2025-03-09 21:55'
---

LINEは友達登録したのち、LINEにてお問合せください。  
PCで友達登録用のQRコードを開く場合は[こちら](https://qr-official.line.me/gs/M_224tupfw_GW.png?oat_content=qr)  
スマホで直接登録される場合は[こちら](https://lin.ee/XXtwaSn)から  

お送りいただきました内容を確認のうえ、折り返しご連絡させていただきます。  
