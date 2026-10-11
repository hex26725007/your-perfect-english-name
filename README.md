# Your Perfect English Name

我要做给中国人起英文名的网站，只做界面不做功能，用NEXTJS框架，需求文档如下：
英文名生成网站 MVP 产品需求文档

1. 产品目标

帮助中国用户获得一个“像自己”的英文名。

系统不随机抽取名字，而是理解用户的中文名、个人特点和使用场景，像一位熟悉中英文文化的起名顾问一样，给出有依据的推荐。

2. MVP 核心体验

用户用一句话介绍自己，例如：

我叫李小雨，性格安静但有主见，喜欢摄影，准备去英国读设计。

系统生成 3 个匹配的英文名，并说明每个名字为什么适合用户。

3. 用户输入

首版只保留一个输入框，降低使用门槛。

提示文案：

介绍一下你自己：你的中文名、性格、兴趣、想给人留下的印象，或英文名的使用场景。

可选快捷标签：

性别：男 / 女 / 不限

场景：日常 / 职场 / 留学

4. 名字生成逻辑

大语言模型根据用户输入完成以下判断：

提取用户的身份信息：中文名、性别、场景。

提取性格与气质：例如温柔、独立、幽默、专业、文艺。

提取偏好和联想：例如自然、艺术、科技、传统或现代。

在真实、常见、易读的英文名中筛选。

避免与用户特点冲突、过于生僻、可能造成负面联想的名字。

输出最适合的 3 个名字，并为每个名字写出个性化理由。

系统应明确表达这是“基于描述的建议”，而不是对性格或人生的绝对判断。

5. 结果展示

每个推荐名包含：

英文名

中文音译与简单发音

名字原意

适合你的原因

气质标签

示例：

Iris
艾瑞斯｜读作：AI-ris
含义：彩虹
标签：文艺、安静、有创造力
适合你的原因：你喜欢摄影和设计，Iris 与色彩、视觉感受有关；它简洁自然，也适合在英国学习和生活时使用。

页面操作仅保留：

重新推荐

复制名字与说明

收藏、账户、分享均不纳入首版。

6. 页面范围

仅一个页面：

顶部：产品名称与一句介绍

中部：自我介绍输入框、选填标签、生成按钮

底部：推荐结果

7. 技术方案

框架：Next.js

前端：React + TypeScript

样式：Tailwind CSS

AI：通过服务端 API 调用大语言模型

数据：MVP 不要求登录和数据库；用户输入与结果仅在当前浏览器会话中保留

安全：AI API Key 仅保存于服务端环境变量，不能暴露在浏览器端

8. MVP 验收标准

用户填写一段自我介绍后，可获得 3 个非随机、带个性化理由的英文名。

推荐结果应体现用户至少 2 项输入特征。

结果生成时间目标在 10 秒内。

页面在手机和电脑上均可正常使用。

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e654c7b7-6ac6-52a8-bcea-5a0fc293ca0d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
