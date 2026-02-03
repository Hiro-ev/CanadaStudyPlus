---
title: 詳細お見積り・お申込み
sitemap:
    lastmod: '2025-01-13 09:14'
heading: 詳細お見積り・お申込み
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
        -
            name: agree
            label: 利用規約に同意します
            type: checkbox
            options: null
            'yes': 同意します
            validate: null
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
---

