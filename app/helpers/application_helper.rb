module ApplicationHelper
    def default_meta_tags
        {
        title:       "Floav",
        description: "ツイートから関心のあるワードを抽出",
        noindex: ! Rails.env.production?,
        charset: "UTF-8",
        og: {
            title: :title,
            description: :description,
            type: "website",
            url: request.original_url,
            image: image_url("wordcloud.png"),
            site_name: "Floav",
            locale: "ja_JP"
        },
        twitter: {
            card: 'summary',
            image: image_url("wordcloud.png")
        }
        }
    end
end