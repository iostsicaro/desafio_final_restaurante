const supabase = require('../servicos/supabase');
const { SUPABASE_BUCKET } = process.env;

const updateImagem = async (req, res, nome, buffer) => {
    const { error } = await supabase
        .storage
        .from(SUPABASE_BUCKET)
        .update(nome, buffer);

    if (error) {
        return res.status(400).json(error.message);
    }
}

const uploadImagem = async (req, res) => {
    const { nome, imagem } = req.body;

    const buffer = Buffer.from(imagem, 'base64');

    try {
        const { error } = await supabase
            .storage
            .from(SUPABASE_BUCKET)
            .upload(nome, buffer);

        if (error) {
            if (error.message.includes("duplicate")) {
                updateImagem(req, res, nome, buffer);
            } else {
                return res.status(400).json(error.message);
            }
        }

        const { publicURL, error: errorPublicUrl } = supabase
            .storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(nome);

        if (errorPublicUrl) {
            return res.status(400).json(errorPublicUrl.message);
        }

        return res.json(publicURL);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    uploadImagem, 
    updateImagem
}