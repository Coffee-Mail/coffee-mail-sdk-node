export interface paths {
    "/v1/product/auth/csrf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/auth/me/api-key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Filtra e-mails por status de envio */
                    status?: "queued" | "processing" | "sent" | "delivered" | "bounced" | "complained" | "failed" | "skipped" | "scheduled" | "cancelled";
                    /** @description Busca parcial por destinatário em to/cc/bcc */
                    recipient?: string;
                    /** @description Filtra e-mails por endereço do remetente */
                    fromEmail?: string;
                    /** @description Busca parcial no assunto do e-mail */
                    subjectContains?: string;
                    /** @description Filtra e-mails enviados por uma API key específica */
                    apiKeyId?: string;
                    /** @description Filtra e-mails que possuem esta tag */
                    tag?: string;
                    /** @description Data/hora inicial do período de busca */
                    from?: string;
                    /** @description Data/hora final do período de busca */
                    to?: string;
                    /** @description Cursor de paginação para buscar registros seguintes */
                    after?: string;
                    /** @description Quantidade máxima de e-mails retornados */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de e-mails retornados */
                            emails: {
                                /**
                                 * Format: uuid
                                 * @description ID único do e-mail
                                 */
                                id: string;
                                /** @description Endereço do remetente */
                                from: string;
                                /** @description Lista de destinatários */
                                to: string[];
                                /** @description Lista de destinatários em cópia */
                                cc: string[] | null;
                                /** @description Lista de destinatários em cópia oculta */
                                bcc: string[] | null;
                                /** @description Assunto do e-mail */
                                subject: string | null;
                                /**
                                 * @description Status atual do envio
                                 * @enum {string}
                                 */
                                status: "queued" | "processing" | "sent" | "delivered" | "bounced" | "complained" | "failed" | "skipped" | "scheduled" | "cancelled";
                                /** @description Número de tentativas de envio realizadas */
                                attempts: number;
                                /** @description Última mensagem de erro registrada no envio */
                                lastError: string | null;
                                /** @description ID da mensagem retornado pelo provedor de envio */
                                messageId: string | null;
                                /** @description API key usada para enviar o e-mail */
                                apiKey: {
                                    /**
                                     * Format: uuid
                                     * @description ID da API key usada no envio
                                     */
                                    id: string;
                                    /** @description Nome da API key usada no envio */
                                    name: string;
                                } | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora de criação do registro
                                 */
                                createdAt: string;
                                /**
                                 * Format: date-time
                                 * @description Data/hora agendada para o envio
                                 */
                                scheduledAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que o e-mail foi enviado
                                 */
                                sentAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que a entrega foi confirmada
                                 */
                                deliveredAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora do bounce, se houve
                                 */
                                bouncedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora da falha, se houve
                                 */
                                failedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora da reclamação de spam, se houve
                                 */
                                complainedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que o e-mail foi suprimido, se houve
                                 */
                                suppressedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora da primeira abertura
                                 */
                                openedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora do primeiro clique em um link
                                 */
                                firstClickedAt: string | null;
                                /** @description Quantidade de vezes que o e-mail foi aberto */
                                openCount: number;
                                /** @description Quantidade de cliques em links do e-mail */
                                clickCount: number;
                                /** @description Aberturas por proxy de privacidade; nao contam como abertura humana */
                                proxyOpenCount: number;
                                /** @description Tags associadas ao e-mail */
                                tags: {
                                    /** @description Nome da tag */
                                    name: string;
                                    /** @description Valor da tag */
                                    value: string;
                                }[] | null;
                                /** @description Corpo do e-mail em HTML */
                                html: string | null;
                                /** @description Corpo do e-mail em texto puro */
                                text: string | null;
                            }[];
                            /** @description Cursor para buscar a próxima página */
                            nextCursor: string | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para envio de um e-mail transacional ou em lote */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Remetente do e-mail */
                        from: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        };
                        /** @description Lista de destinatários do e-mail */
                        to: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Lista de destinatários em cópia */
                        cc?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Lista de destinatários em cópia oculta */
                        bcc?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Endereço para onde respostas devem ser enviadas */
                        replyTo?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        };
                        /** @description Assunto do e-mail */
                        subject?: string;
                        /** @description Corpo do e-mail em HTML */
                        html?: string;
                        /** @description Corpo do e-mail em texto puro */
                        text?: string;
                        /** @description Cabeçalhos SMTP customizados a incluir no envio */
                        headers?: {
                            [key: string]: string;
                        };
                        /** @description Arquivos anexados ao e-mail */
                        attachments?: {
                            /** @description Nome do arquivo anexado */
                            filename: string;
                            /** @description Conteúdo do anexo codificado em base64 */
                            content: string;
                            /** @description MIME type do anexo */
                            contentType: string;
                            /**
                             * @description Se o anexo aparece inline no corpo ou como anexo separado
                             * @enum {string}
                             */
                            disposition: "attachment" | "inline";
                            /** @description Content-ID usado para referenciar o anexo inline no HTML */
                            cid?: string;
                        }[];
                        /**
                         * Format: uuid
                         * @description ID do template usado para montar o e-mail
                         */
                        templateId?: string;
                        /** @description Variáveis para preencher o template */
                        variables?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Categoria do envio para fins de rastreio e supressão
                         * @enum {string}
                         */
                        emailType?: "transactional" | "broadcast";
                        /** @description Categoria usada para checar a lista de supressão */
                        suppressionCategory?: string;
                        /** @description Tags para categorizar e filtrar o e-mail depois */
                        tags?: {
                            /** @description Nome da tag */
                            name: string;
                            /** @description Valor da tag */
                            value: string;
                        }[];
                        /**
                         * Format: date-time
                         * @description Data/hora futura para o envio agendado do e-mail
                         */
                        scheduledAt?: string;
                        /** @description Metadados customizados para rastreio ou webhook */
                        metadata?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description ID único do e-mail criado
                             */
                            id: string;
                            /**
                             * @description Status inicial do e-mail após o envio
                             * @enum {string}
                             */
                            status: "queued" | "scheduled";
                            /**
                             * Format: date-time
                             * @description Data/hora em que o e-mail entrou na fila
                             */
                            queuedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Remetente do e-mail */
                        from: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        };
                        /** @description Lista de destinatários do e-mail */
                        to: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Lista de destinatários em cópia */
                        cc?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Lista de destinatários em cópia oculta */
                        bcc?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        }[];
                        /** @description Endereço para onde respostas devem ser enviadas */
                        replyTo?: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail
                             */
                            email: string;
                            /** @description Nome de exibição do contato */
                            name?: string;
                        };
                        /** @description Assunto do e-mail */
                        subject?: string;
                        /** @description Corpo do e-mail em HTML */
                        html?: string;
                        /** @description Corpo do e-mail em texto puro */
                        text?: string;
                        /** @description Cabeçalhos SMTP customizados a incluir no envio */
                        headers?: {
                            [key: string]: string;
                        };
                        /** @description Arquivos anexados ao e-mail */
                        attachments?: {
                            /** @description Nome do arquivo anexado */
                            filename: string;
                            /** @description Conteúdo do anexo codificado em base64 */
                            content: string;
                            /** @description MIME type do anexo */
                            contentType: string;
                            /**
                             * @description Se o anexo aparece inline no corpo ou como anexo separado
                             * @enum {string}
                             */
                            disposition: "attachment" | "inline";
                            /** @description Content-ID usado para referenciar o anexo inline no HTML */
                            cid?: string;
                        }[];
                        /**
                         * Format: uuid
                         * @description ID do template usado para montar o e-mail
                         */
                        templateId?: string;
                        /** @description Variáveis para preencher o template */
                        variables?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Categoria do envio para fins de rastreio e supressão
                         * @enum {string}
                         */
                        emailType?: "transactional" | "broadcast";
                        /** @description Categoria usada para checar a lista de supressão */
                        suppressionCategory?: string;
                        /** @description Tags para categorizar e filtrar o e-mail depois */
                        tags?: {
                            /** @description Nome da tag */
                            name: string;
                            /** @description Valor da tag */
                            value: string;
                        }[];
                        /**
                         * Format: date-time
                         * @description Data/hora futura para o envio agendado do e-mail
                         */
                        scheduledAt?: string;
                        /** @description Metadados customizados para rastreio ou webhook */
                        metadata?: {
                            [key: string]: unknown;
                        };
                    }[];
                };
            };
            responses: {
                /** @description Default Response */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Indica que o envio deste item foi aceito com sucesso
                             * @enum {boolean}
                             */
                            ok: true;
                            /** @description Resultado do envio bem-sucedido */
                            data: {
                                /**
                                 * Format: uuid
                                 * @description ID único do e-mail criado
                                 */
                                id: string;
                                /**
                                 * @description Status inicial do e-mail após o envio
                                 * @enum {string}
                                 */
                                status: "queued" | "scheduled";
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que o e-mail entrou na fila
                                 */
                                queuedAt: string;
                            };
                        } | {
                            /**
                             * @description Indica que o envio deste item falhou
                             * @enum {boolean}
                             */
                            ok: false;
                            /** @description Mensagem de erro do item que falhou */
                            error: string;
                        })[];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Lista de tags disponíveis para filtro */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Tags distintas usadas em e-mails enviados */
                            tags: {
                                /** @description Nome da tag */
                                name: string;
                                /** @description Valores distintos já usados para esta tag */
                                values: string[];
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Detalhes completos de um e-mail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description ID único do e-mail
                             */
                            id: string;
                            /** @description Endereço do remetente */
                            from: string;
                            /** @description Lista de destinatários */
                            to: string[];
                            /** @description Lista de destinatários em cópia */
                            cc: string[] | null;
                            /** @description Lista de destinatários em cópia oculta */
                            bcc: string[] | null;
                            /** @description Assunto do e-mail */
                            subject: string | null;
                            /**
                             * @description Status atual do envio
                             * @enum {string}
                             */
                            status: "queued" | "processing" | "sent" | "delivered" | "bounced" | "complained" | "failed" | "skipped" | "scheduled" | "cancelled";
                            /** @description Número de tentativas de envio realizadas */
                            attempts: number;
                            /** @description Última mensagem de erro registrada no envio */
                            lastError: string | null;
                            /** @description ID da mensagem retornado pelo provedor de envio */
                            messageId: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora de criação do registro
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data/hora agendada para o envio
                             */
                            scheduledAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora em que o e-mail foi enviado
                             */
                            sentAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora em que a entrega foi confirmada
                             */
                            deliveredAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora do bounce, se houve
                             */
                            bouncedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora da falha, se houve
                             */
                            failedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora da reclamação de spam, se houve
                             */
                            complainedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora em que o e-mail foi suprimido, se houve
                             */
                            suppressedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora da primeira abertura
                             */
                            openedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data/hora do primeiro clique em um link
                             */
                            firstClickedAt: string | null;
                            /** @description Quantidade de vezes que o e-mail foi aberto */
                            openCount: number;
                            /** @description Quantidade de cliques em links do e-mail */
                            clickCount: number;
                            /** @description Aberturas registradas por proxy de privacidade (Gmail Image Proxy, Apple MPP). Nao contam como abertura humana */
                            proxyOpenCount: number;
                            /** @description Tags associadas ao e-mail */
                            tags: {
                                /** @description Nome da tag */
                                name: string;
                                /** @description Valor da tag */
                                value: string;
                            }[] | null;
                            /** @description Corpo do e-mail em HTML */
                            html: string | null;
                            /** @description Corpo do e-mail em texto puro */
                            text: string | null;
                            /** @description API key usada para enviar o e-mail */
                            apiKey?: {
                                /** @description ID da API key usada no envio */
                                id: string;
                                /** @description Nome da API key usada no envio */
                                name: string;
                            } | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/{id}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Histórico de eventos de um e-mail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description ID único do e-mail
                             */
                            id: string;
                            /** @description Linha do tempo de eventos do e-mail */
                            events: {
                                /**
                                 * @description Tipo do evento ocorrido no ciclo de vida do e-mail
                                 * @enum {string}
                                 */
                                type: "queued" | "processing" | "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained" | "failed";
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que o evento ocorreu
                                 */
                                timestamp: string;
                                /** @description Dados adicionais associados ao evento */
                                metadata?: {
                                    [key: string]: unknown;
                                };
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": null;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/emails/{id}/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description ID único do e-mail criado
                             */
                            id: string;
                            /**
                             * @description Status inicial do e-mail após o envio
                             * @enum {string}
                             */
                            status: "queued" | "scheduled";
                            /**
                             * Format: date-time
                             * @description Data/hora em que o e-mail entrou na fila
                             */
                            queuedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Listagem de webhooks cadastrados */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de webhooks cadastrados na organização */
                            webhooks: {
                                /**
                                 * Format: uuid
                                 * @description Identificador do webhook
                                 */
                                id: string;
                                /** @description URL de destino que recebe os eventos */
                                url: string;
                                /** @description Eventos aos quais o webhook está inscrito */
                                events: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                                /**
                                 * @description Status atual do webhook (active, paused ou disabled)
                                 * @enum {string}
                                 */
                                status: "active" | "paused" | "disabled";
                                /** @description Descrição informada pelo usuário para o webhook */
                                description: string | null;
                                /** @description Indica se o webhook possui um segredo de assinatura configurado */
                                hasSecret: boolean;
                                /**
                                 * Format: date-time
                                 * @description Data e hora de criação do webhook
                                 */
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Criação de um novo webhook para receber eventos */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: uri
                         * @description URL de destino que receberá os eventos
                         */
                        url: string;
                        /** @description Eventos aos quais o webhook deve se inscrever */
                        events: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                        /** @description Descrição opcional do webhook */
                        description?: string;
                    };
                };
            };
            responses: {
                /** @description Webhook recém-criado, com o segredo completo */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador do webhook
                             */
                            id: string;
                            /** @description URL de destino que recebe os eventos */
                            url: string;
                            /** @description Eventos aos quais o webhook está inscrito */
                            events: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                            /**
                             * @description Status atual do webhook (active, paused ou disabled)
                             * @enum {string}
                             */
                            status: "active" | "paused" | "disabled";
                            /** @description Descrição informada pelo usuário para o webhook */
                            description: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora de criação do webhook
                             */
                            createdAt: string;
                            /** @description Segredo usado para assinar os payloads enviados, exibido uma única vez */
                            secret: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/webhooks/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Dados de um webhook cadastrado */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador do webhook
                             */
                            id: string;
                            /** @description URL de destino que recebe os eventos */
                            url: string;
                            /** @description Eventos aos quais o webhook está inscrito */
                            events: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                            /**
                             * @description Status atual do webhook (active, paused ou disabled)
                             * @enum {string}
                             */
                            status: "active" | "paused" | "disabled";
                            /** @description Descrição informada pelo usuário para o webhook */
                            description: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora de criação do webhook
                             */
                            createdAt: string;
                            /** @description Segredo de assinatura completo (quando disponível) */
                            secret: string | null;
                            /** @description Prévia truncada do segredo, para exibição segura */
                            secretPreview: string | null;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            /** @description Atualização parcial de um webhook existente */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: uri
                         * @description Nova URL de destino que receberá os eventos
                         */
                        url?: string;
                        /** @description Novos eventos aos quais o webhook deve se inscrever */
                        events?: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                        /** @description Nova descrição do webhook */
                        description?: string | null;
                    };
                };
            };
            responses: {
                /** @description Dados de um webhook cadastrado */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador do webhook
                             */
                            id: string;
                            /** @description URL de destino que recebe os eventos */
                            url: string;
                            /** @description Eventos aos quais o webhook está inscrito */
                            events: ("email.queued" | "email.processing" | "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.opened" | "email.clicked" | "email.bounced" | "email.complained" | "email.failed" | "email.suppressed" | "email.scheduled" | "email.cancelled" | "email.unsubscribed" | "billing.plan_changed")[];
                            /**
                             * @description Status atual do webhook (active, paused ou disabled)
                             * @enum {string}
                             */
                            status: "active" | "paused" | "disabled";
                            /** @description Descrição informada pelo usuário para o webhook */
                            description: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora de criação do webhook
                             */
                            createdAt: string;
                            /** @description Segredo de assinatura completo (quando disponível) */
                            secret: string | null;
                            /** @description Prévia truncada do segredo, para exibição segura */
                            secretPreview: string | null;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            /** @description Alteração de status de um webhook */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Novo status do webhook (ativo ou pausado)
                         * @enum {string}
                         */
                        status: "active" | "paused";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        trace?: never;
    };
    "/v1/product/webhooks/{id}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resultado de um disparo de teste do webhook */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Resultado do envio de teste
                             * @enum {string}
                             */
                            status: "success" | "failed";
                            /** @description Status HTTP retornado pelo endpoint de destino */
                            statusCode: number | null;
                            /** @description Corpo da resposta retornada pelo endpoint de destino */
                            body: string | null;
                            /** @description Mensagem de erro, caso o envio de teste tenha falhado */
                            error: string | null;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/webhooks/{id}/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Filtra entregas por tipo de evento */
                    eventType?: string;
                    /** @description Filtra entregas pelo status atual */
                    status?: "pending" | "success" | "failed" | "exhausted";
                    /** @description Data inicial do período de busca */
                    from?: string;
                    /** @description Data final do período de busca */
                    to?: string;
                    /** @description Quantidade máxima de entregas retornadas */
                    limit?: number;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Listagem paginável de entregas de um webhook */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de tentativas de entrega do webhook */
                            deliveries: {
                                /**
                                 * Format: uuid
                                 * @description Identificador da tentativa de entrega
                                 */
                                id: string;
                                /**
                                 * Format: uuid
                                 * @description Identificador do webhook associado
                                 */
                                webhookId: string;
                                /**
                                 * Format: uuid
                                 * @description Evento de e-mail que originou a entrega
                                 */
                                emailEventId: string | null;
                                /** @description Tipo de evento disparado (ex: email.delivered) */
                                eventType: string;
                                /** @description Status HTTP retornado pelo endpoint de destino */
                                responseStatus: number | null;
                                /** @description Corpo da resposta retornada pelo endpoint de destino */
                                responseBody: string | null;
                                /** @description Quantidade de tentativas de envio já realizadas */
                                attempts: number;
                                /** @description Mensagem do último erro ocorrido no envio */
                                lastError: string | null;
                                /** @description Status atual da entrega (pending, success, failed ou exhausted) */
                                status: string;
                                /**
                                 * Format: date-time
                                 * @description Data e hora da próxima tentativa de reenvio
                                 */
                                nextRunAt: string;
                                /**
                                 * Format: date-time
                                 * @description Data e hora em que a entrega foi criada
                                 */
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/webhooks/{id}/rotate-secret": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/domains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de domínios cadastrados na organização */
                            domains: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único do domínio
                                 */
                                id: string;
                                /** @description Nome do domínio cadastrado para envio de emails */
                                name: string;
                                /**
                                 * @description Situação atual da verificação do domínio
                                 * @enum {string}
                                 */
                                status: "pending" | "verified" | "failed";
                                /** @description Seletor usado no registro DKIM do domínio */
                                dkimSelector: string;
                                /** @description Chave pública DKIM gerada para o domínio */
                                dkimPublicKey: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data e hora em que o domínio foi verificado
                                 */
                                verifiedAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data e hora da última verificação de DNS realizada
                                 */
                                lastCheckAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data e hora em que o domínio foi cadastrado
                                 */
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Nome do domínio a ser cadastrado para envio de emails */
                        name: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do domínio criado
                             */
                            id: string;
                            /** @description Nome do domínio cadastrado para envio de emails */
                            name: string;
                            /**
                             * @description Situação inicial da verificação do domínio
                             * @enum {string}
                             */
                            status: "pending" | "verified" | "failed";
                            /** @description Registros DNS que o cliente precisa publicar para ativar o domínio */
                            dkimRecordsToPublish: {
                                /**
                                 * @description Tipo do registro DNS a ser publicado
                                 * @enum {string}
                                 */
                                type: "TXT" | "CNAME";
                                /** @description Nome do host/subdomínio onde o registro deve ser criado */
                                host: string;
                                /** @description Valor que deve ser publicado no registro DNS */
                                value: string;
                                /** @description TTL em segundos sugerido para o registro */
                                ttl?: number;
                                /** @description Indica se o registro pertence à infraestrutura global da plataforma */
                                isInfrastructure?: boolean;
                            }[];
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/domains/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do domínio
                             */
                            id: string;
                            /** @description Nome do domínio cadastrado para envio de emails */
                            name: string;
                            /**
                             * @description Situação atual da verificação do domínio
                             * @enum {string}
                             */
                            status: "pending" | "verified" | "failed";
                            /** @description Seletor usado no registro DKIM do domínio */
                            dkimSelector: string;
                            /** @description Chave pública DKIM gerada para o domínio */
                            dkimPublicKey: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora em que o domínio foi verificado
                             */
                            verifiedAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora da última verificação de DNS realizada
                             */
                            lastCheckAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora em que o domínio foi cadastrado
                             */
                            createdAt: string;
                            /** @description Registros DNS pendentes que o cliente precisa publicar */
                            dnsRecordsToPublish: {
                                /**
                                 * @description Tipo do registro DNS a ser publicado
                                 * @enum {string}
                                 */
                                type: "TXT" | "CNAME";
                                /** @description Nome do host/subdomínio onde o registro deve ser criado */
                                host: string;
                                /** @description Valor que deve ser publicado no registro DNS */
                                value: string;
                                /** @description TTL em segundos sugerido para o registro */
                                ttl?: number;
                                /** @description Indica se o registro pertence à infraestrutura global da plataforma */
                                isInfrastructure?: boolean;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            /** @description Reautenticação exigida para confirmar a exclusão do domínio */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Método usado para reautenticar antes de excluir o domínio
                         * @enum {string}
                         */
                        method: "totp" | "password";
                        /** @description Senha ou código TOTP informado para confirmar a exclusão */
                        credential: string;
                    } | null;
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/domains/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do domínio
                             */
                            id: string;
                            /** @description Nome do domínio verificado */
                            name: string;
                            /**
                             * @description Situação atual da verificação do domínio
                             * @enum {string}
                             */
                            status: "pending" | "verified" | "failed";
                            /**
                             * Format: date-time
                             * @description Data e hora em que o domínio foi verificado com sucesso
                             */
                            verifiedAt: string | null;
                            /** @description Resultados individuais de cada checagem de DNS realizada */
                            checks: {
                                /** @description Resultado da checagem do registro SPF */
                                spf: {
                                    /** @description Indica se o registro DNS verificado está correto */
                                    ok: boolean;
                                    /** @description Valor esperado para o registro DNS */
                                    expected: string;
                                    /** @description Valor do registro DNS encontrado na consulta */
                                    got: string | null;
                                    /** @description Valores encontrados no DNS que bateram com o esperado */
                                    matches: string[];
                                };
                                /** @description Resultado da checagem do registro DKIM */
                                dkim: {
                                    /** @description Indica se o registro DNS verificado está correto */
                                    ok: boolean;
                                    /** @description Valor esperado para o registro DNS */
                                    expected: string;
                                    /** @description Valor do registro DNS encontrado na consulta */
                                    got: string | null;
                                    /** @description Valores encontrados no DNS que bateram com o esperado */
                                    matches: string[];
                                };
                                /** @description Resultado da checagem do registro DMARC */
                                dmarc: {
                                    /** @description Indica se o registro DNS verificado está correto */
                                    ok: boolean;
                                    /** @description Valor esperado para o registro DNS */
                                    expected: string;
                                    /** @description Valor do registro DNS encontrado na consulta */
                                    got: string | null;
                                    /** @description Valores encontrados no DNS que bateram com o esperado */
                                    matches: string[];
                                };
                                /** @description Resultado da checagem de propriedade do domínio */
                                ownership: {
                                    /** @description Indica se o registro DNS verificado está correto */
                                    ok: boolean;
                                    /** @description Valor esperado para o registro DNS */
                                    expected: string;
                                    /** @description Valor do registro DNS encontrado na consulta */
                                    got: string | null;
                                    /** @description Valores encontrados no DNS que bateram com o esperado */
                                    matches: string[];
                                };
                                /** @description Resultado da checagem do registro SPF Canônico de infraestrutura */
                                infrastructureSpf?: {
                                    /** @description Indica se o registro DNS verificado está correto */
                                    ok: boolean;
                                    /** @description Valor esperado para o registro DNS */
                                    expected: string;
                                    /** @description Valor do registro DNS encontrado na consulta */
                                    got: string | null;
                                    /** @description Valores encontrados no DNS que bateram com o esperado */
                                    matches: string[];
                                };
                            };
                            /** @description Checagens obrigatórias para considerar o domínio verificado */
                            requiredChecks: ("spf" | "dkim" | "dmarc" | "ownership" | "infrastructureSpf")[];
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/domains/{id}/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resultado da checagem de saúde de DNS/SPF/DKIM/DMARC do domínio */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do domínio
                             */
                            domainId: string;
                            /** @description Nome do domínio verificado */
                            domain: string;
                            /**
                             * @description Resultado geral da checagem de saúde do domínio
                             * @enum {string}
                             */
                            status: "healthy" | "warning" | "critical";
                            /** @description Resultado da checagem do registro SPF */
                            spf: {
                                /** @description Indica se o registro SPF está correto */
                                ok: boolean;
                                /** @description Valor esperado do registro SPF */
                                expected: string;
                                /** @description Valor do registro SPF encontrado no DNS */
                                got: string | null;
                            };
                            /** @description Resultado da checagem do registro DKIM */
                            dkim: {
                                /** @description Indica se o registro DKIM está correto */
                                ok: boolean;
                                /** @description Valor esperado do registro DKIM */
                                expected: string;
                                /** @description Valor do registro DKIM encontrado no DNS */
                                got: string | null;
                            };
                            /** @description Resultado da checagem do registro DMARC */
                            dmarc: {
                                /** @description Indica se o registro DMARC está correto */
                                ok: boolean;
                                /** @description Valor esperado do registro DMARC */
                                expected: string;
                                /** @description Valor do registro DMARC encontrado no DNS */
                                got: string | null;
                            };
                            /**
                             * Format: date-time
                             * @description Data e hora em que a checagem foi realizada
                             */
                            checkedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/domains/{id}/warmup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Status atual do aquecimento (warmup) de envio do domínio */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do domínio
                             */
                            domainId: string;
                            /** @description Dia atual do período de aquecimento (warmup) */
                            currentDay: number;
                            /** @description Limite diário de envios permitido para o dia atual */
                            dailyQuota: number;
                            /** @description Quantidade de emails já enviados hoje */
                            sentToday: number;
                            /** @description Quantidade de envios restantes na cota diária */
                            remainingToday: number;
                            /** @description Percentual da cota diária já utilizado */
                            quotaUsedPercent: number;
                            /** @description Data do último envio registrado para o domínio */
                            lastSendDate: string | null;
                        } | null;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/suppressions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Filtra supressões pela situação atual */
                    status?: "active" | "expired" | "inactive";
                    /** @description Filtra supressões pelo motivo */
                    reason?: "manual" | "bounce" | "isp_block" | "mailbox_not_found" | "complaint" | "unsubscribe";
                    /** @description Filtra supressões pela origem: manual ou automática */
                    source?: "manual" | "auto";
                    /** @description Filtra supressões pela categoria */
                    category?: "manual" | "bounce" | "block" | "complaint" | "unsubscribe" | "invalid_email" | "global";
                    /** @description Cursor de paginação para continuar a partir do último resultado */
                    after?: string;
                    /** @description Quantidade máxima de supressões retornadas por página */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resposta paginada com as supressões cadastradas */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de supressões encontradas */
                            suppressions: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único da supressão
                                 */
                                id: string;
                                /** @description Endereço de email suprimido */
                                email: string;
                                /**
                                 * @description Motivo que originou a supressão
                                 * @enum {string}
                                 */
                                reason: "manual" | "bounce" | "isp_block" | "mailbox_not_found" | "complaint" | "unsubscribe";
                                /**
                                 * @description Origem da supressão: manual ou automática
                                 * @enum {string}
                                 */
                                source: "manual" | "auto";
                                /** @description Categoria de classificação da supressão */
                                category: string;
                                /**
                                 * @description Situação atual da supressão
                                 * @enum {string}
                                 */
                                status: "active" | "expired" | "inactive";
                                /**
                                 * Format: date-time
                                 * @description Data em que a supressão expira e o email volta a receber envios
                                 */
                                expiresAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data de criação da supressão
                                 */
                                createdAt: string;
                            }[];
                            /** @description Cursor para buscar a próxima página de resultados */
                            nextCursor: string | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Dados para adicionar um email à lista de supressão */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Endereço de email a ser suprimido
                         */
                        email: string;
                        /**
                         * @description Motivo da supressão
                         * @enum {string}
                         */
                        reason?: "manual" | "bounce" | "complaint";
                        /**
                         * Format: date-time
                         * @description Data em que a supressão expira e o email volta a receber envios
                         */
                        expiresAt?: string;
                    };
                };
            };
            responses: {
                /** @description Registro de um email na lista de supressão */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único da supressão
                             */
                            id: string;
                            /** @description Endereço de email suprimido */
                            email: string;
                            /**
                             * @description Motivo que originou a supressão
                             * @enum {string}
                             */
                            reason: "manual" | "bounce" | "isp_block" | "mailbox_not_found" | "complaint" | "unsubscribe";
                            /**
                             * @description Origem da supressão: manual ou automática
                             * @enum {string}
                             */
                            source: "manual" | "auto";
                            /** @description Categoria de classificação da supressão */
                            category: string;
                            /**
                             * @description Situação atual da supressão
                             * @enum {string}
                             */
                            status: "active" | "expired" | "inactive";
                            /**
                             * Format: date-time
                             * @description Data em que a supressão expira e o email volta a receber envios
                             */
                            expiresAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data de criação da supressão
                             */
                            createdAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/suppressions/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Dados para importação em lote de emails suprimidos */
            requestBody: {
                content: {
                    "application/json": {
                        suppressions: {
                            /**
                             * Format: email
                             * @description Endereço de email a ser suprimido
                             */
                            email: string;
                            /** @enum {string} */
                            reason?: "manual" | "bounce" | "complaint";
                        }[];
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            insertedCount: number;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/suppressions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Registro de um email na lista de supressão */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único da supressão
                             */
                            id: string;
                            /** @description Endereço de email suprimido */
                            email: string;
                            /**
                             * @description Motivo que originou a supressão
                             * @enum {string}
                             */
                            reason: "manual" | "bounce" | "isp_block" | "mailbox_not_found" | "complaint" | "unsubscribe";
                            /**
                             * @description Origem da supressão: manual ou automática
                             * @enum {string}
                             */
                            source: "manual" | "auto";
                            /** @description Categoria de classificação da supressão */
                            category: string;
                            /**
                             * @description Situação atual da supressão
                             * @enum {string}
                             */
                            status: "active" | "expired" | "inactive";
                            /**
                             * Format: date-time
                             * @description Data em que a supressão expira e o email volta a receber envios
                             */
                            expiresAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data de criação da supressão
                             */
                            createdAt: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/suppressions/{id}/reactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/senders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Lista de identidades de remetente cadastradas */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de remetentes da organização */
                            senders: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único do remetente
                                 */
                                id: string;
                                /** @description Endereço de e-mail do remetente */
                                email: string;
                                /** @description Nome de exibição do remetente */
                                displayName: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data/hora em que o remetente foi verificado
                                 */
                                verifiedAt: string | null;
                                /** @description Se o remetente está ativo para envio */
                                active: boolean;
                                /**
                                 * Format: date-time
                                 * @description Data/hora de criação do remetente
                                 */
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para registrar uma identidade de remetente de e-mail avulso */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Endereço de e-mail do remetente a ser verificado
                         */
                        email: string;
                        /** @description Nome de exibição do remetente */
                        displayName?: string;
                    };
                };
            };
            responses: {
                /** @description Remetente recém-criado, aguardando verificação */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do remetente
                             */
                            id: string;
                            /** @description Endereço de e-mail do remetente */
                            email: string;
                            /** @description Nome de exibição do remetente */
                            displayName: string | null;
                            /** @description Token enviado ao email para confirmar a verificação */
                            verificationToken: string;
                            /**
                             * Format: date-time
                             * @description Data/hora em que o remetente foi verificado
                             */
                            verifiedAt: string | null;
                            /** @description Se o remetente está ativo para envio */
                            active: boolean;
                            /**
                             * Format: date-time
                             * @description Data/hora de criação do remetente
                             */
                            createdAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/senders/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para confirmar a verificação de um remetente */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: uuid
                         * @description Token de verificação recebido por e-mail
                         */
                        token: string;
                    };
                };
            };
            responses: {
                /** @description Remetente verificado com sucesso */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do remetente
                             */
                            id: string;
                            /** @description Endereço de e-mail do remetente */
                            email: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/senders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/audiences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Dados para criação de uma audiência */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Nome da audiência */
                        name: string;
                        /** @description Descrição da audiência */
                        description?: string;
                    };
                };
            };
            responses: {
                /** @description Dados de uma audiência */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único da audiência
                             */
                            id: string;
                            /** @description Nome da audiência */
                            name: string;
                            /** @description Descrição da audiência */
                            description: string | null;
                            /** @description Se a audiência está ativa */
                            active: boolean;
                            /** @description Quantidade de contatos na audiência */
                            contactsCount: number;
                            /**
                             * Format: date-time
                             * @description Data de criação da audiência
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data da última atualização da audiência
                             */
                            updatedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/audiences/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Novo nome da audiência */
                        name?: string;
                        /** @description Nova descrição da audiência */
                        description?: string | null;
                        /** @description Se a audiência está ativa */
                        active?: boolean;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/audiences/{id}/contacts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resposta da listagem de contatos */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de contatos */
                            contacts: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único do contato
                                 */
                                id: string;
                                /** @description Endereço de e-mail do contato */
                                email: string;
                                /** @description Primeiro nome do contato */
                                firstName: string | null;
                                /** @description Sobrenome do contato */
                                lastName: string | null;
                                /** @description Dados extras do contato em formato livre */
                                metadata: {
                                    [key: string]: unknown;
                                };
                                /**
                                 * Format: date-time
                                 * @description Data de criação do contato
                                 */
                                createdAt: string;
                            }[];
                            /** @description Total de contatos encontrados */
                            total: number;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            /** @description Dados para criação de um contato */
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Endereço de e-mail do contato
                         */
                        email: string;
                        /** @description Primeiro nome do contato */
                        firstName?: string;
                        /** @description Sobrenome do contato */
                        lastName?: string;
                        /** @description Dados extras do contato em formato livre */
                        metadata?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Dados de um contato */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do contato
                             */
                            id: string;
                            /** @description Endereço de e-mail do contato */
                            email: string;
                            /** @description Primeiro nome do contato */
                            firstName: string | null;
                            /** @description Sobrenome do contato */
                            lastName: string | null;
                            /** @description Dados extras do contato em formato livre */
                            metadata: {
                                [key: string]: unknown;
                            };
                            /**
                             * Format: date-time
                             * @description Data de criação do contato
                             */
                            createdAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/audiences/{id}/contacts/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            /** @description Dados para adição de contatos em lote a uma audiência */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Lista de contatos para adicionar em lote */
                        contacts: {
                            /**
                             * Format: email
                             * @description Endereço de e-mail do contato
                             */
                            email: string;
                            /** @description Primeiro nome do contato */
                            firstName?: string;
                            /** @description Sobrenome do contato */
                            lastName?: string;
                            /** @description Dados extras do contato em formato livre */
                            metadata?: {
                                [key: string]: unknown;
                            };
                        }[];
                    };
                };
            };
            responses: {
                /** @description Resultado da adição de contatos em lote */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Quantidade de contatos inseridos com sucesso */
                            inserted: number;
                            /** @description Quantidade de contatos ignorados */
                            skipped: number;
                            /** @description Lista de erros ocorridos durante a inserção em lote */
                            errors: {
                                /** @description Endereço de e-mail do contato com erro */
                                email: string;
                                /** @description Motivo pelo qual o contato não foi inserido */
                                reason: string;
                            }[];
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/audiences/{id}/contacts/{contactId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    contactId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Novo primeiro nome do contato */
                        firstName?: string | null;
                        /** @description Novo sobrenome do contato */
                        lastName?: string | null;
                        /** @description Dados extras do contato em formato livre */
                        metadata?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    contactId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/broadcasts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Filtra pelo status do broadcast */
                    status?: "draft" | "scheduled" | "sending" | "sent" | "failed" | "cancelled";
                    /** @description Data inicial do período de busca */
                    from?: string;
                    /** @description Data final do período de busca */
                    to?: string;
                    /** @description Cursor de paginação para buscar a próxima página */
                    after?: string;
                    /** @description Quantidade máxima de broadcasts retornados */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resposta da listagem de broadcasts */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de broadcasts */
                            broadcasts: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único do broadcast
                                 */
                                id: string;
                                /**
                                 * Format: uuid
                                 * @description Identificador da audiência destinatária
                                 */
                                audienceId: string;
                                /** @description Nome da audiência destinatária */
                                audienceName: string | null;
                                /**
                                 * Format: uuid
                                 * @description Identificador do template usado no envio
                                 */
                                templateId: string | null;
                                /** @description Assunto do e-mail */
                                subject: string;
                                /** @description Endereço de e-mail do remetente */
                                fromEmail: string;
                                /** @description Endereço de e-mail para respostas */
                                replyTo: string | null;
                                /** @description Status atual do broadcast */
                                status: string;
                                /**
                                 * Format: date-time
                                 * @description Data e hora agendadas para o envio
                                 */
                                scheduledAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data e hora em que o envio foi concluído
                                 */
                                sentAt: string | null;
                                /**
                                 * Format: date-time
                                 * @description Data e hora em que o broadcast foi cancelado
                                 */
                                cancelledAt: string | null;
                                /** @description Total de destinatários do broadcast */
                                recipientsTotal: number;
                                /** @description Quantidade de destinatários enfileirados para envio */
                                recipientsQueued: number;
                                /** @description Quantidade de destinatários com falha no envio */
                                recipientsFailed: number;
                                /**
                                 * Format: date-time
                                 * @description Data de criação do broadcast
                                 */
                                createdAt: string;
                                /**
                                 * Format: date-time
                                 * @description Data da última atualização do broadcast
                                 */
                                updatedAt: string;
                            }[];
                            /** @description Cursor para buscar a próxima página de resultados */
                            nextCursor: string | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: uuid
                         * @description Identificador da audiência destinatária
                         */
                        audienceId: string;
                        /**
                         * Format: uuid
                         * @description Identificador do template usado no envio
                         */
                        templateId?: string;
                        /** @description Assunto do e-mail */
                        subject?: string;
                        /** @description Conteúdo HTML do e-mail */
                        html?: string;
                        /** @description Conteúdo em texto puro do e-mail */
                        text?: string;
                        /**
                         * Format: email
                         * @description Endereço de e-mail do remetente
                         */
                        fromEmail: string;
                        /**
                         * Format: email
                         * @description Endereço de e-mail para respostas
                         */
                        replyTo?: string;
                        /** @description Variáveis usadas na personalização do template */
                        variables?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Dados de um broadcast */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do broadcast
                             */
                            id: string;
                            /**
                             * Format: uuid
                             * @description Identificador da audiência destinatária
                             */
                            audienceId: string;
                            /** @description Nome da audiência destinatária */
                            audienceName: string | null;
                            /**
                             * Format: uuid
                             * @description Identificador do template usado no envio
                             */
                            templateId: string | null;
                            /** @description Assunto do e-mail */
                            subject: string;
                            /** @description Endereço de e-mail do remetente */
                            fromEmail: string;
                            /** @description Endereço de e-mail para respostas */
                            replyTo: string | null;
                            /** @description Status atual do broadcast */
                            status: string;
                            /**
                             * Format: date-time
                             * @description Data e hora agendadas para o envio
                             */
                            scheduledAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora em que o envio foi concluído
                             */
                            sentAt: string | null;
                            /**
                             * Format: date-time
                             * @description Data e hora em que o broadcast foi cancelado
                             */
                            cancelledAt: string | null;
                            /** @description Total de destinatários do broadcast */
                            recipientsTotal: number;
                            /** @description Quantidade de destinatários enfileirados para envio */
                            recipientsQueued: number;
                            /** @description Quantidade de destinatários com falha no envio */
                            recipientsFailed: number;
                            /**
                             * Format: date-time
                             * @description Data de criação do broadcast
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data da última atualização do broadcast
                             */
                            updatedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/broadcasts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/broadcasts/{id}/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/broadcasts/{id}/test-send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Endereço de e-mail para receber o teste
                         */
                        to: string;
                        /**
                         * @description Valores simulados das variáveis para renderização no teste
                         * @default {}
                         */
                        variables?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Indica se o e-mail de teste foi despachado com sucesso */
                            success: boolean;
                            /** @description Identificador da mensagem gerada */
                            messageId: string;
                            /**
                             * Format: email
                             * @description E-mail do destinatário do teste
                             */
                            recipient: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/broadcasts/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resultado do cancelamento de um broadcast */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do broadcast
                             */
                            id: string;
                            /** @description Status atual do broadcast após o cancelamento */
                            status: string;
                            /**
                             * Format: date-time
                             * @description Data e hora em que o broadcast foi cancelado
                             */
                            cancelledAt: string | null;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Filtra estatísticas por domínio de envio */
                    domainId?: string;
                    /** @description Filtra estatísticas por tag de campanha */
                    tag?: string;
                    /** @description Início do intervalo de datas para o filtro */
                    startDate?: string;
                    /** @description Fim do intervalo de datas para o filtro */
                    endDate?: string;
                    /** @description Agrupamento dos dados: dia, semana ou mês */
                    granularity?: "day" | "week" | "month";
                    /** @description Atalho para intervalo relativo (últimos 7/30/90 dias) */
                    period?: "last7d" | "last30d" | "last90d";
                    /** @description Filtra estatísticas por tipo de email: all, transactional ou broadcast */
                    emailType?: "all" | "transactional" | "broadcast";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resumo consolidado de estatísticas de envio de emails */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Total de emails enviados no período */
                            totalSent: number;
                            /** @description Total de emails entregues com sucesso */
                            totalDelivered: number;
                            /** @description Total de emails que retornaram como bounce */
                            totalBounced: number;
                            /** @description Total de emails que falharam no envio */
                            totalFailed: number;
                            /**
                             * @description Total de emails abertos no período
                             * @default 0
                             */
                            totalOpened: number;
                            /**
                             * @description Total de links clicados no período
                             * @default 0
                             */
                            totalClicked: number;
                            /**
                             * @description Taxa de entrega percentual
                             * @default 0
                             */
                            deliveryRate: number;
                            /**
                             * @description Taxa de abertura percentual
                             * @default 0
                             */
                            openRate: number;
                            /**
                             * @description Taxa de cliques percentual
                             * @default 0
                             */
                            clickRate: number;
                            /** @description Divisão de métricas entre transacionais e broadcasts */
                            breakdown?: {
                                transactional: {
                                    sent: number;
                                    delivered: number;
                                    bounced: number;
                                    opened: number;
                                    clicked: number;
                                };
                                broadcast: {
                                    sent: number;
                                    delivered: number;
                                    bounced: number;
                                    opened: number;
                                    clicked: number;
                                };
                            };
                            /**
                             * @description Distribuição dos principais clientes de email
                             * @default []
                             */
                            topClients: {
                                /** @description Nome do cliente de email / navegador */
                                name: string;
                                /** @description Total de aberturas */
                                count: number;
                                /** @description Porcentagem relativa */
                                percentage: number;
                                /** @description Tipo de dispositivo detectado */
                                deviceType: string;
                            }[];
                            /** @description Série histórica de estatísticas agrupada por período */
                            data: {
                                /** @description Início do intervalo de tempo agregado */
                                period: string;
                                /** @description Emails enviados nesse intervalo */
                                sent: number;
                                /** @description Emails entregues nesse intervalo */
                                delivered: number;
                                /** @description Emails com bounce nesse intervalo */
                                bounced: number;
                                /** @description Emails que falharam nesse intervalo */
                                failed: number;
                                /**
                                 * @description Emails abertos nesse intervalo
                                 * @default 0
                                 */
                                opened: number;
                                /**
                                 * @description Emails com cliques nesse intervalo
                                 * @default 0
                                 */
                                clicked: number;
                                /**
                                 * @description Emails transacionais no intervalo
                                 * @default 0
                                 */
                                transactional: number;
                                /**
                                 * @description Emails de broadcast no intervalo
                                 * @default 0
                                 */
                                broadcast: number;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resposta contendo os templates de e-mail da organização */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Lista de templates de e-mail cadastrados */
                            data: {
                                /**
                                 * Format: uuid
                                 * @description Identificador único do template
                                 */
                                id: string;
                                /**
                                 * Format: uuid
                                 * @description Identificador da organização dona do template
                                 */
                                organisationId: string;
                                /** @description Nome do template */
                                name: string;
                                /** @description Identificador amigável único para invocação via API ou SDK */
                                alias: string | null;
                                /** @description Assunto padrão do e-mail */
                                subject: string | null;
                                /** @description Texto de pré-visualização na caixa de entrada */
                                preheader: string | null;
                                /** @description Código-fonte HTML compilado do template */
                                html: string;
                                /** @description Estado estruturado da árvore de blocos visuais */
                                contentJson: {
                                    [key: string]: unknown;
                                } | null;
                                /** @description Versão em texto simples do template */
                                textPayload: string | null;
                                /** @description Variáveis disponíveis para interpolação no template */
                                variables: {
                                    /** @description Nome da variável usada no template */
                                    name: string;
                                    /** @description Descrição do propósito da variável */
                                    description?: string;
                                    /**
                                     * @description Tipo da variável
                                     * @enum {string}
                                     */
                                    type?: "string" | "number" | "color";
                                    /** @description Valor padrão de fallback */
                                    fallbackValue?: string;
                                }[];
                                /** @description Indica se o template está ativo para uso */
                                isActive: boolean;
                                /**
                                 * @description Formato do código-fonte do template
                                 * @enum {string}
                                 */
                                format: "html" | "react";
                                /**
                                 * @description Idioma de origem do conteúdo do template
                                 * @enum {string}
                                 */
                                sourceLocale: "pt-BR" | "en" | "es";
                                /**
                                 * Format: date-time
                                 * @description Data de criação do template
                                 */
                                createdAt: string;
                                /**
                                 * Format: date-time
                                 * @description Data da última atualização do template
                                 */
                                updatedAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Nome do template */
                        name: string;
                        /** @description Identificador amigável único para invocação via API ou SDK */
                        alias?: string | null;
                        /** @description Assunto padrão do e-mail */
                        subject?: string | null;
                        /** @description Texto de pré-visualização na caixa de entrada */
                        preheader?: string | null;
                        /** @description Código-fonte HTML compilado do template */
                        html: string;
                        /** @description Estado estruturado da árvore de blocos visuais */
                        contentJson?: {
                            [key: string]: unknown;
                        } | null;
                        /** @description Versão em texto simples do template */
                        textPayload?: string;
                        /** @description Variáveis disponíveis para interpolação no template */
                        variables?: {
                            /** @description Nome da variável usada no template */
                            name: string;
                            /** @description Descrição do propósito da variável */
                            description?: string;
                            /**
                             * @description Tipo da variável
                             * @enum {string}
                             */
                            type?: "string" | "number" | "color";
                            /** @description Valor padrão de fallback */
                            fallbackValue?: string;
                        }[];
                        /**
                         * @description Formato do código-fonte do template
                         * @enum {string}
                         */
                        format?: "html" | "react";
                        /**
                         * @description Idioma de origem do conteúdo do template
                         * @enum {string}
                         */
                        sourceLocale?: "pt-BR" | "en" | "es";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do template
                             */
                            id: string;
                            /**
                             * Format: uuid
                             * @description Identificador da organização dona do template
                             */
                            organisationId: string;
                            /** @description Nome do template */
                            name: string;
                            /** @description Identificador amigável único para invocação via API ou SDK */
                            alias: string | null;
                            /** @description Assunto padrão do e-mail */
                            subject: string | null;
                            /** @description Texto de pré-visualização na caixa de entrada */
                            preheader: string | null;
                            /** @description Código-fonte HTML compilado do template */
                            html: string;
                            /** @description Estado estruturado da árvore de blocos visuais */
                            contentJson: {
                                [key: string]: unknown;
                            } | null;
                            /** @description Versão em texto simples do template */
                            textPayload: string | null;
                            /** @description Variáveis disponíveis para interpolação no template */
                            variables: {
                                /** @description Nome da variável usada no template */
                                name: string;
                                /** @description Descrição do propósito da variável */
                                description?: string;
                                /**
                                 * @description Tipo da variável
                                 * @enum {string}
                                 */
                                type?: "string" | "number" | "color";
                                /** @description Valor padrão de fallback */
                                fallbackValue?: string;
                            }[];
                            /** @description Indica se o template está ativo para uso */
                            isActive: boolean;
                            /**
                             * @description Formato do código-fonte do template
                             * @enum {string}
                             */
                            format: "html" | "react";
                            /**
                             * @description Idioma de origem do conteúdo do template
                             * @enum {string}
                             */
                            sourceLocale: "pt-BR" | "en" | "es";
                            /**
                             * Format: date-time
                             * @description Data de criação do template
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data da última atualização do template
                             */
                            updatedAt: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/templates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do template
                             */
                            id: string;
                            /**
                             * Format: uuid
                             * @description Identificador da organização dona do template
                             */
                            organisationId: string;
                            /** @description Nome do template */
                            name: string;
                            /** @description Identificador amigável único para invocação via API ou SDK */
                            alias: string | null;
                            /** @description Assunto padrão do e-mail */
                            subject: string | null;
                            /** @description Texto de pré-visualização na caixa de entrada */
                            preheader: string | null;
                            /** @description Código-fonte HTML compilado do template */
                            html: string;
                            /** @description Estado estruturado da árvore de blocos visuais */
                            contentJson: {
                                [key: string]: unknown;
                            } | null;
                            /** @description Versão em texto simples do template */
                            textPayload: string | null;
                            /** @description Variáveis disponíveis para interpolação no template */
                            variables: {
                                /** @description Nome da variável usada no template */
                                name: string;
                                /** @description Descrição do propósito da variável */
                                description?: string;
                                /**
                                 * @description Tipo da variável
                                 * @enum {string}
                                 */
                                type?: "string" | "number" | "color";
                                /** @description Valor padrão de fallback */
                                fallbackValue?: string;
                            }[];
                            /** @description Indica se o template está ativo para uso */
                            isActive: boolean;
                            /**
                             * @description Formato do código-fonte do template
                             * @enum {string}
                             */
                            format: "html" | "react";
                            /**
                             * @description Idioma de origem do conteúdo do template
                             * @enum {string}
                             */
                            sourceLocale: "pt-BR" | "en" | "es";
                            /**
                             * Format: date-time
                             * @description Data de criação do template
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data da última atualização do template
                             */
                            updatedAt: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": null;
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Nome do template */
                        name?: string;
                        /** @description Identificador amigável único para invocação via API ou SDK */
                        alias?: string | null;
                        /** @description Assunto padrão do e-mail */
                        subject?: string | null;
                        /** @description Texto de pré-visualização na caixa de entrada */
                        preheader?: string | null;
                        /** @description Código-fonte HTML compilado do template */
                        html?: string;
                        /** @description Estado estruturado da árvore de blocos visuais */
                        contentJson?: {
                            [key: string]: unknown;
                        } | null;
                        /** @description Versão em texto simples do template */
                        textPayload?: string | null;
                        /** @description Variáveis disponíveis para interpolação no template */
                        variables?: {
                            /** @description Nome da variável usada no template */
                            name: string;
                            /** @description Descrição do propósito da variável */
                            description?: string;
                            /**
                             * @description Tipo da variável
                             * @enum {string}
                             */
                            type?: "string" | "number" | "color";
                            /** @description Valor padrão de fallback */
                            fallbackValue?: string;
                        }[];
                        /**
                         * @description Formato do código-fonte do template
                         * @enum {string}
                         */
                        format?: "html" | "react";
                        /** @description Indica se o template está ativo para uso */
                        isActive?: boolean;
                        /**
                         * @description Idioma de origem do conteúdo do template
                         * @enum {string}
                         */
                        sourceLocale?: "pt-BR" | "en" | "es";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: uuid
                             * @description Identificador único do template
                             */
                            id: string;
                            /**
                             * Format: uuid
                             * @description Identificador da organização dona do template
                             */
                            organisationId: string;
                            /** @description Nome do template */
                            name: string;
                            /** @description Identificador amigável único para invocação via API ou SDK */
                            alias: string | null;
                            /** @description Assunto padrão do e-mail */
                            subject: string | null;
                            /** @description Texto de pré-visualização na caixa de entrada */
                            preheader: string | null;
                            /** @description Código-fonte HTML compilado do template */
                            html: string;
                            /** @description Estado estruturado da árvore de blocos visuais */
                            contentJson: {
                                [key: string]: unknown;
                            } | null;
                            /** @description Versão em texto simples do template */
                            textPayload: string | null;
                            /** @description Variáveis disponíveis para interpolação no template */
                            variables: {
                                /** @description Nome da variável usada no template */
                                name: string;
                                /** @description Descrição do propósito da variável */
                                description?: string;
                                /**
                                 * @description Tipo da variável
                                 * @enum {string}
                                 */
                                type?: "string" | "number" | "color";
                                /** @description Valor padrão de fallback */
                                fallbackValue?: string;
                            }[];
                            /** @description Indica se o template está ativo para uso */
                            isActive: boolean;
                            /**
                             * @description Formato do código-fonte do template
                             * @enum {string}
                             */
                            format: "html" | "react";
                            /**
                             * @description Idioma de origem do conteúdo do template
                             * @enum {string}
                             */
                            sourceLocale: "pt-BR" | "en" | "es";
                            /**
                             * Format: date-time
                             * @description Data de criação do template
                             */
                            createdAt: string;
                            /**
                             * Format: date-time
                             * @description Data da última atualização do template
                             */
                            updatedAt: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/v1/product/templates/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para gerar uma pré-visualização do template sem persistir dados */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Código-fonte HTML ou JSX do template a pré-visualizar */
                        html: string;
                        /**
                         * @description Formato do template de origem
                         * @default html
                         * @enum {string}
                         */
                        format?: "html" | "react";
                        /**
                         * @description Valores das variáveis usadas para popular o template
                         * @default {}
                         */
                        variables?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description HTML final renderizado da pré-visualização */
                            html: string;
                            /** @description Versão em texto simples da pré-visualização */
                            text: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/templates/format": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para formatar o código-fonte de um template */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Código-fonte HTML ou JSX a ser formatado */
                        html: string;
                        /**
                         * @description Formato do código de origem
                         * @default html
                         * @enum {string}
                         */
                        format?: "html" | "react";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Código-fonte formatado */
                            html: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/templates/test-render": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Payload para gerar uma pré-visualização do template sem persistir dados */
            requestBody: {
                content: {
                    "application/json": {
                        /** @description Código-fonte HTML ou JSX do template a pré-visualizar */
                        html: string;
                        /**
                         * @description Formato do template de origem
                         * @default html
                         * @enum {string}
                         */
                        format?: "html" | "react";
                        /**
                         * @description Valores das variáveis usadas para popular o template
                         * @default {}
                         */
                        variables?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description HTML final renderizado e sanitizado */
                            html: string;
                            /** @description Versão em texto simples do e-mail renderizado */
                            text: string;
                            sanitizeReport: {
                                /** @description Quantidade de tags <script> removidas */
                                scripts: number;
                                /** @description Quantidade de tags <iframe> removidas */
                                iframes: number;
                                /** @description Quantidade de links javascript: removidos */
                                javascriptHrefs: number;
                                /** @description Quantidade de atributos de evento inline removidos */
                                eventHandlers: number;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/product/templates/{id}/test-send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Endereço de e-mail para receber o teste
                         */
                        to: string;
                        /**
                         * Format: email
                         * @description Endereço do remetente (opcional)
                         */
                        from?: string;
                        /** @description Sobrescrever o assunto no teste (opcional) */
                        subject?: string;
                        /**
                         * @description Valores simulados das variáveis para renderização no teste
                         * @default {}
                         */
                        variables?: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Indica se o e-mail de teste foi despachado com sucesso */
                            success: boolean;
                            /** @description Identificador da mensagem gerada */
                            messageId: string;
                            /**
                             * Format: email
                             * @description E-mail do destinatário do teste
                             */
                            recipient: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Error: {
            error: {
                /** @description Stable error code (e.g. EMAIL_NOT_FOUND) */
                code: string;
                /** @description Human-readable message (localized via Accept-Language) */
                message: string;
                details?: {
                    [key: string]: unknown;
                };
            };
        };
    };
    responses: {
        /** @description Invalid request body or parameters */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Missing or invalid authentication */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Resource not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Rate limit exceeded */
        TooManyRequests: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Internal server error */
        InternalError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
